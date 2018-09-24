const THREADS = 6;

const canvasSmall  = getCanvas("fractal-canvas-small");
const canvasMedium = getCanvas("fractal-canvas-medium");
const canvasLarge  = getCanvas("fractal-canvas-large");
const canvasRetina = getCanvas("fractal-canvas-retina");

// center X coord, center Y coord, and radius of square.
// to pan, we move x and y.
// to zoom, we make the radius smaller.
let cx = -0.7;
let cy = 0;
let radius = 1.5;

// keep track of whether the low res rendering is underway.
// we don't let keyboard commands run while this is true,
// so that you can mash arrow keys and actually see what's
// happening.
let smallRenderInProgress = false;
let renderTimes = [0,0,0,0];

// Initialise our fractal workers and set things up.
async function init() {

	// Initialise our fractal workers:
	const fractalQueue = await FractalWorkerQueue(THREADS);
	let max_iterations = 700;
	let escape_radius = 100;
	fractalQueue.setMaxIterations(max_iterations);
	fractalQueue.setEscapeRadius(escape_radius);
	fractalQueue.setGradients([
		{ at: 0,     red: 50,  green: 0,   blue: 90 },  // purple
		{ at: 0.005, red: 0,   green: 0,   blue: 90 },  // dark blue
		{ at: 0.02,  red: 100, green: 255, blue: 100 }, // bright green
		{ at: 0.035, red: 255, green: 255, blue: 255 }, // white
		{ at: 0.06,  red: 50,  green: 0,   blue: 255 }, // purply blue
		{ at: 0.1,   red: 255, green: 0,   blue: 0   }, // red
		{ at: 0.16,  red: 255, green: 238, blue: 50  }, // yellow
		{ at: 0.3,   red: 234, green: 41,  blue: 255 }, // pink
		{ at: 0.4,   red: 0,   green: 255, blue: 234 }, // cyan
		{ at: 0.5,   red: 0,   green: 255, blue: 0   }, // green
		{ at: 0.6,   red: 255, green: 0,   blue: 0   }, // red
		{ at: 0.7,   red: 255, green: 238, blue: 50  }, // yellow
		{ at: 0.8,   red: 255, green: 255, blue: 255 }, // white
		{ at: 1,     red: 0,   green: 0,   blue: 0   }  // black
	]);
	const doRender = () => render(fractalQueue);
	window.fractalQueue = fractalQueue;

	// Provide a simple console interface to a couple of handy commands:
	console.log("wasm-fractal advanced commands")
	console.log("==============================")
	console.log("zoom = NUMBER");
	console.log("iters = NUMBER");
	console.log("escape_radius = NUMBER");
	console.log("perf");
	Object.defineProperties(window, {
		iters: {
			get: () => {
				return max_iterations;
			},
			set: (val) => {
				if(typeof val != "number") return;
				max_iterations = val;
				fractalQueue.setMaxIterations(val);
				doRender();
			}
		},
		escape_radius: {
			get: () => {
				return escape_radius;
			},
			set: (val) => {
				if(typeof val != "number") return;
				escape_radius = val;
				fractalQueue.setEscapeRadius(val);
				doRender();
			}
		},
		zoom: {
			get: () => {
				return 1.5 / radius;
			},
			set: (val) => {
				if(typeof val != "number") return;
				radius = 1.5 / val;
				doRender();
			}
		},
		perf: {
			get: () => {
				console.log("small:  ", renderTimes[0]);
				console.log("medium: ", renderTimes[1]);
				console.log("large:  ", renderTimes[2]);
				console.log("retina: ", renderTimes[3]);
			}
		}
	})

	// Redraw on window resize:
	window.addEventListener("resize", () => {
		setCanvasSizes()
		doRender();
	});
	setCanvasSizes();

	// Basic keyboard pan and zoom:
	const panStep = 0.1;
	const zoomStep = 0.7;
	document.addEventListener("keydown", e => {
		if(e.keyCode == 38 || e.keyCode == 87 /* UP | w */) {
			if(smallRenderInProgress) return;
			cy -= panStep * radius;
			doRender();
		} else if(e.keyCode == 40 || e.keyCode == 83 /* DOWN | s  */) {
			if(smallRenderInProgress) return;
			cy += panStep * radius;
			doRender();
		} else if(e.keyCode == 37 || e.keyCode == 65 /* LEFT | a  */) {
			if(smallRenderInProgress) return;
			cx -= panStep * radius;
			doRender();
		} else if(e.keyCode == 39 || e.keyCode == 68 /* RIGHT | d  */) {
			if(smallRenderInProgress) return;
			cx += panStep * radius;
			doRender();
		} else if(e.keyCode == 189 || e.keyCode == 173 || e.keyCode == 109 /* - | _  */) {
			if(smallRenderInProgress) return;
			radius /= zoomStep;
			doRender();
		} else if (e.keyCode == 187 || e.keyCode == 61 || e.keyCode == 107 /* = | +  */) {
			if(smallRenderInProgress) return;
			radius *= zoomStep;
			doRender();
		}
	})

	doRender();
}

// Given an array of fractal workers, this function renders
// the fractal based on the current cx, cy and radius,
async function render(fractalQueue) {

	// stop any queued render requests:
	fractalQueue.clear();

	// reset perf timings:
	renderTimes = [0,0,0,0];

	// work out the bounding box in terms of fractal coords.
	const w = document.body.clientWidth;
	const h = document.body.clientHeight;
	const ratio = w / h;

	let cHeight;
	let cWidth;
	if(ratio < 1) {
		// height is bigger
		cWidth = radius * 2;
		cHeight = cWidth / ratio;
	} else {
		// width is bigger
		cHeight = radius * 2;
		cWidth = cHeight * ratio;
	}

	// this is the area we want to render:
	const top = cy - cHeight / 2;
	const left = cx - cWidth / 2;
	const bottom = top + cHeight;
	const right = left + cWidth;

	const pixelsPerWorker = 100000;

	// for each canvas size, split the work into batches:
	[canvasSmall, canvasMedium, canvasLarge, canvasRetina].forEach((c, i) => {

		const perf1 = performance.now();
		if(i === 0) {
			smallRenderInProgress = true;
		}

		const canvasWidth = c.el.width;
		const canvasHeight = c.el.height;
		c.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		const jobs = (canvasWidth * canvasHeight) / pixelsPerWorker;

		const rowsPerJob = Math.ceil(canvasHeight / jobs);
		const coordsPerRow = cHeight / (canvasHeight / rowsPerJob);

		let topCoord = top;
		let topPx = 0;

		let renderPs = [];

		while(topPx < canvasHeight) {
			let thisTopPx = topPx;

			renderPs.push(
				fractalQueue.render({
					top: topCoord,
					left: left,
					bottom: topCoord + coordsPerRow,
					right: right,
					width: canvasWidth,
					height: rowsPerJob
				}).then(imageData => {
					c.ctx.putImageData(imageData, 0, thisTopPx);
				})
			);

			topCoord += coordsPerRow;
			topPx += rowsPerJob;
		}

		// We add a little basic profiling, and keep track of
		// whether the smallest canvas has rendered yet:
		Promise.all(renderPs).then(_ => {
			renderTimes[i] = performance.now() - perf1;
			if(i === 0) {
				smallRenderInProgress = false;
			}
		}, _ => {
			renderTimes[i] = 0;
			if(i === 0) {
				smallRenderInProgress = false;
			}
		});

	});

}

function getCanvas(id){
	const c = document.getElementById(id);
	return {
		el: c,
		ctx: c.getContext("2d")
	};
}

function setCanvasSizes() {
	const w = document.body.clientWidth;
	const h = document.body.clientHeight;

	canvasSmall.el.width = Math.round(w / 4);
	canvasSmall.el.height = Math.round(h / 4);

	canvasMedium.el.width = Math.round(w / 2);
	canvasMedium.el.height = Math.round(h / 2);

	canvasLarge.el.width = w;
	canvasLarge.el.height = h;

	canvasRetina.el.width = w * 2;
	canvasRetina.el.height = h * 2;
}

// A queue of fractal workers; we spawn as many workers as "threads" asks for,
// and hand off work to the next available worker on each render call.
function FractalWorkerQueue(threads){

	const workers = [];
	for(let i = 0; i < threads; i++) workers.push(FractalWorker());

	return Promise.all(workers).then(_workers => {

		const CANCELLED = "CANCELLED";

		let uid = 1;
		let queue = Queue();
		let workers = _workers.slice();

		function run() {

			if(!workers.length || queue.empty()) {
				return;
			}

			const item = queue.take();
			const worker = workers.pop();

			worker.render(item.opts)
				.then(imageData => {
					if(uid !== item.id) throw CANCELLED;
					return imageData;
				})
				.then(item.resolve, item.reject).then(_ => {
					workers.push(worker);
					run();
				});

		}

		const methods = {
			render: function(opts){
				return new Promise((resolve, reject) => {
					queue.add({ opts: opts, id: uid, resolve, reject });
					run();
				});
			},
			clear: function() {
				uid++;
				let item;
				while(item = queue.take()) item.reject(CANCELLED);
			},
			CANCELLED: CANCELLED
		};

		["setEscapeRadius", "setMaxIterations", "setGradients"].forEach(n => {
			methods[n] = function(){
				const args = arguments;
				_workers.forEach(worker => worker[n].apply(worker, args));
			};
		});

		return methods;

	});

}

// A quick first-in-first-out linkedlist based queue
function Queue(){

	let first = null;
	let last = null;

	function init(item) {
		first = last = { item, next: null };
	}

	return {
		add: function(item) {
			if(!first) return init(item);
			const entry = { item, next: null };
			last.next = entry;
			last = entry;
		},
		take: function() {
			if(!first) return null;
			const entry = first;
			first = first.next;
			return entry.item;
		},
		clear: function() {
			first = last = null;
		},
		empty: function() {
			return first === null;
		}
	}
}

// A FractalWorker can be asked to render a region of a fractal.
// Behind the scenes it uses a web worker and wasm to do this:
//
function FractalWorker(){

	const fractalWorker = new Worker("js/worker.js");

	let uid = 1;
	let renderDeferreds = {};

	function execCommand(cmd, args) {
		if(!Array.isArray(cmd)) cmd = [cmd];
		let curr = window;
		for(let i = 0; i < cmd.length - 1; i++) curr = curr[cmd[i]];
		curr[cmd[cmd.length-1]].apply(curr, args);
	}

	const interface = {

		// render takes opts that look like:
		//
		// {
		// 	height: 5000,
		// 	width: 1000,
		// 	top: -1,
		// 	left: 0,
		// 	bottom: 0.5,
		// 	right: 1
		// }
		//
		render: function(opts) {
			return new Promise((resolve, reject) => {
				const thisId = uid++;
				renderDeferreds[thisId] = { resolve: resolve };
				fractalWorker.postMessage({
					type: "render",
					id: thisId,
					opts: opts
				});
			}).then(uint8Array => {
				return new ImageData(uint8Array, opts.width, opts.height);
			});
		},

		setEscapeRadius: function(er) {
			fractalWorker.postMessage({
				type: "setEscapeRadius",
				er: er
			});
		},

		setMaxIterations: function(mi) {
			fractalWorker.postMessage({
				type: "setMaxIterations",
				mi: mi
			});
		},

		// setGradients takes an array of colours to use for rendering, like:
		//
		// [{ at: 0, red: 100, green: 255, blue: 0 }, { at: 1, red: 0, green: 100, blue: 0 }]
		//
		setGradients: function(gradients) {
			fractalWorker.postMessage({
				type: "setGradients",
				gradients: gradients
			});
		},

		// setName takes a string, and allows the renderer to identify itself in output
		// messages and such (handy for debugging).
		setName: function(name) {
			fractalWorker.postMessage({
				type: "setName",
				name: name
			});
		}

	};

	return new Promise(function(resolve, reject){

		fractalWorker.onmessage = function(msg){
			switch(msg.data.type) {

				// rendering is finished; handle result:
				case "render_finished":
				const id = msg.data.id;
				const deferred = renderDeferreds[id];
				deferred.resolve(msg.data.buffer);
				delete renderDeferreds[id];

				// return interface on init:
				case "init":
				if(msg.data.value) resolve(interface);
				else reject(msg.data.reason);
				break;

				// allow web worker to run arbitrary commands:
				case "call":
				execCommand(msg.data.command, msg.data.args)
				break;

			}
		};

	});

}

// Run everything. If we fail to initialise workers, display
// no support message.
init().then(_ => {
	displayInstructions();
	document.addEventListener("keydown", hideInstructions);
	document.addEventListener("mousedown", hideInstructions);
}, _ => {
	displayNoSupport("I'm sorry, but there was an issue fetching or instantiating the WASM based Web Workers. Do you have a plugin enabled that blocks WASM?");
})