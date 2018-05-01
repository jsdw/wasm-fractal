async function init() {

	const canvas = document.getElementById("fractal-canvas");
	const ctx = canvas.getContext("2d");
	window.addEventListener("onresize", () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

	const fractalWorker = await FractalWorker();
	console.log("Worker Initialised");

	window.TEST_INTERFACE = fractalWorker;
}

init();


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
			})
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