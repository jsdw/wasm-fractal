importScripts("wasm_fractal.js");

wasmFractal("./wasm_fractal_bg.wasm").then(() => {

    const {Renderer, Gradient, Opts, Colour} = wasmFractal;

    const renderer = new Renderer();

    // after init, an interface is provided which allows the worker
    // to receive messages.
    onmessage = function(msg) {
        switch(msg.data.type) {

            case "render":
            const opts = toOpts(msg.data.opts);
            renderer.render(opts);
            break;

            case "setName":
            renderer.set_name(msg.data.name);
            break;

            case "setGradient":
            renderer.clear_gradient();
            msg.data.gradient.forEach(c => renderer.push_gradient(toGradient(c)))
            break;

        }
    };

    // let things know that we are ready to accept commands:
    postMessage({
        type: "init",
        value: true
    });

    // push a JS gradient definition into wasm:
    function toGradient(rawGradient) {
        const g = new Gradient(
            rawGradient.at,
            rawGradient.red,
            rawGradient.green,
            rawGradient.blue
        );
    }

    // push JS render opts into wasm:
    function toOpts(rawOpts) {
        const opts = new Opts();
        opts.set_width(rawOpts.width);
        opts.set_height(rawOpts.height);
        opts.set_top(rawOpts.top);
        opts.set_left(rawOpts.left);
        opts.set_bottom(rawOpts.bottom);
        opts.set_right(rawOpts.right);
        return opts;
    }

});

// quick bindings to some useful commands:
function log() {
    postMessage({
        type: "call",
        command: ["console", "log"],
        args: Array.prototype.slice.call(arguments)
    })
}
function error() {
    postMessage({
        type: "call",
        command: ["console", "error"],
        args: Array.prototype.slice.call(arguments)
    })
}
