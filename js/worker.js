importScripts("wasm_Fractal.js");

wasmFractal("./wasm_fractal_bg.wasm").then(() => {

    // let things know that we are ready to accept commands:
    postMessage({
        type: "init",
        value: true
    });


    wasmFractal.greet("World!");
    log("greeted", "complete");
});


// quick bindings to some useful commands:
function alert(str) {
    postMessage({
        type: "call",
        command: "alert",
        args: [str]
    })
}
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