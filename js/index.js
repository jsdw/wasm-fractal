
function FractalWorker(){

	const fractalWorker = new Worker("js/worker.js");

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
		// 	id: 123,
		// 	height: 5000,
		// 	width: 1000,
		// 	top: -1,
		// 	left: 0,
		// 	bottom: 0.5,
		// 	right: 1,
		// 	colours: [{ at: 0, red: 100, green: 255, blue: 0 }, { at: 1, red: 0, green: 100, blue: 0 }]
		// }
		//
		render: function(opts) {
			fractalWorker.postMessage({
				type: "render",
				opts: opts
			});
		}

	};

	return new Promise(function(resolve, reject){

		fractalWorker.onmessage = function(msg){
			switch(msg.data.type) {

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

FractalWorker().then(interface => {
	console.log("Worker initialised");
	window.TEST_INTERFACE = interface;
}, err => {
	console.error("Error initialising worker:", err);
});