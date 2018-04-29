importScripts("wasm_Fractal.js");

wasmFractal("./wasm_fractal_bg.wasm").then(() => {

    // let things know that we are ready to accept commands:
    postMessage({
        type: "init",
        value: true
    });

});

// after init, an interface is provided which allows the worker
// to receive messages.
onmessage = function(msg) {
    switch(msg.data.type) {

        case "render":
        renderFractalSquare(msg.data.opts);
        break;

    }
};

// pack our opts object into a WASM struct and pass it to our render method.
function renderFractalSquare(rawOpts) {
    const Opts = wasmFractal.Opts;
    const Colour = wasmFractal.Colour;

    let opts = Opts.new(rawOpts.id);
    opts.set_width(rawOpts.width);
    opts.set_height(rawOpts.height);
    opts.set_top(rawOpts.top);
    opts.set_left(rawOpts.left);
    opts.set_bottom(rawOpts.bottom);
    opts.set_right(rawOpts.right);
    rawOpts.colours.forEach(c => {
         const colour = Colour.at_rgb(c.at, c.red, c.green, c.blue);
         opts.push_colour(colour);
    });

    wasmFractal.render(opts);
}

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