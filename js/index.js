const canvasSmall = getCanvas("fractal-canvas-small");
const canvasMedium = getCanvas("fractal-canvas-medium");
const canvasLarge = getCanvas("fractal-canvas-large");

// center X coord, center Y coord, and radius of square.
// to pan, we move x and y.
// to zoom, we make the radius smaller.
let cx = -0.7;
let cy = 0;
let radius = 1;

async function init() {

	window.addEventListener("onresize", setCanvasSizes);
	setCanvasSizes();

	const fractalWorker = await FractalWorker();
	console.log("Workers Initialised");

	window.TEST_INTERFACE = fractalWorker;
	render([fractalWorker]);
}

async function render(fractalWorkers) {

	// work out the bounding box in terms of fractal coords.
	const w = document.body.clientWidth;
	const h = document.body.clientHeight;
	const ratio = w / h;

	//@todo work out coords that need rendering, then create
	//packets of work to render everything and send them off
	//to a threaded pool thing (which can be cleared each
	//time we re-render).

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

// Run everything:
init();