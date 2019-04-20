importScripts("wasm_fractal.js");

// not ordinarily necessary, but for streaming WASM compilation to
// work it needs to be served with a content-type of application/wasm,
// which isn't always the case (eg with php -S), so we remove for now:
delete WebAssembly.instantiateStreaming;

wasmFractal("./wasm_fractal_bg.wasm").then((wasm) => {

    const {Renderer, Gradients, Opts} = wasmFractal;
    const renderer = new Renderer();

    // after init, an interface is provided which allows the worker
    // to receive messages.
    onmessage = function(msg) {
        switch(msg.data.type) {

            case "render":
            const opts = toOpts(msg.data.opts);
            render(msg.data.id, opts);
            break;

            case "setName":
            renderer.set_name(msg.data.name);
            break;

            case "setEscapeRadius":
            renderer.set_escape_radius(msg.data.er);
            break;

            case "setMaxIterations":
            renderer.set_max_iterations(msg.data.mi);
            break;

            case "setGradients":
            let gs = new Gradients();
            msg.data.gradients.forEach(g => gs.add(g.at, g.red, g.green, g.blue));
            renderer.set_gradients(gs);
            break;

        }
    };

    // let things know that we are ready to accept commands:
    postMessage({
        type: "init",
        value: true
    });

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

    // perform a render and post back the resulting U8 RGB buffer:
    function render(id, opts) {
        renderer.render(opts);
        postMessage({
            type: "render_finished",
            id: id,
            // this is cloned as it is posted back, from the worker so we don't
            // have to worry about the WASM memory changing under our feet:
            buffer: new Uint8ClampedArray(wasm.memory.buffer, renderer.output_ptr(), renderer.output_len())
        })
    }

}, _ => {

    // let things know that we failed to initialise the WASM:
    postMessage({
        type: "init",
        value: false,
        reason: "failed to fetch and instantiate the WASM"
    });

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
