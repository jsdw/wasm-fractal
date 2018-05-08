
                (function() {
                    var wasm;
                    const __exports = {};
                    

let cachedDecoder = new TextDecoder('utf-8');

let cachedUint8Memory = null;
function getUint8Memory() {
    if (cachedUint8Memory === null ||
        cachedUint8Memory.buffer !== wasm.memory.buffer)
        cachedUint8Memory = new Uint8Array(wasm.memory.buffer);
    return cachedUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedDecoder.decode(getUint8Memory().slice(ptr, ptr + len));
}

let cachedUint32Memory = null;
function getUint32Memory() {
    if (cachedUint32Memory === null ||
        cachedUint32Memory.buffer !== wasm.memory.buffer)
        cachedUint32Memory = new Uint32Array(wasm.memory.buffer);
    return cachedUint32Memory;
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
    if (cachedGlobalArgumentPtr === null)
        cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
    return cachedGlobalArgumentPtr;
}

function getGlobalArgument(arg) {
    const idx = globalArgumentPtr() / 4 + arg;
    return getUint32Memory()[idx];
}

__exports.__wbg_f_log_log_n = function(arg0) {
    let len0 = getGlobalArgument(0);
    let v0 = getStringFromWasm(arg0, len0);
    log(v0);
}

__exports.__wbg_f_error_error_n = function(arg0) {
    let len0 = getGlobalArgument(0);
    let v0 = getStringFromWasm(arg0, len0);
    error(v0);
}

let cachedEncoder = new TextEncoder('utf-8');

function passStringToWasm(arg) {

    const buf = cachedEncoder.encode(arg);
    const ptr = wasm.__wbindgen_malloc(buf.length);
    getUint8Memory().set(buf, ptr);
    return [ptr, buf.length];
}

function setGlobalArgument(arg, i) {
    const idx = globalArgumentPtr() / 4 + i;
    getUint32Memory()[idx] = arg;
}

class ConstructorToken {
    constructor(ptr) {
        this.ptr = ptr;
    }
}

__exports.Opts = class Opts {

                static __construct(ptr) {
                    return new Opts(new ConstructorToken(ptr));
                }

                constructor(...args) {
                    if (args.length === 1 && args[0] instanceof ConstructorToken) {
                        this.ptr = args[0].ptr;
                        return;
                    }

                    // This invocation of new will call this constructor with a ConstructorToken
                    let instance = Opts.new(...args);
                    this.ptr = instance.ptr;
                }
            free() {
                const ptr = this.ptr;
                this.ptr = 0;
                wasm.__wbg_opts_free(ptr);
            }
        static new() {
    return Opts.__construct(wasm.opts_new());
}
set_width(arg0) {
    return wasm.opts_set_width(this.ptr, arg0);
}
set_height(arg0) {
    return wasm.opts_set_height(this.ptr, arg0);
}
set_top(arg0) {
    return wasm.opts_set_top(this.ptr, arg0);
}
set_left(arg0) {
    return wasm.opts_set_left(this.ptr, arg0);
}
set_bottom(arg0) {
    return wasm.opts_set_bottom(this.ptr, arg0);
}
set_right(arg0) {
    return wasm.opts_set_right(this.ptr, arg0);
}
}

__exports.Gradients = class Gradients {

                static __construct(ptr) {
                    return new Gradients(new ConstructorToken(ptr));
                }

                constructor(...args) {
                    if (args.length === 1 && args[0] instanceof ConstructorToken) {
                        this.ptr = args[0].ptr;
                        return;
                    }

                    // This invocation of new will call this constructor with a ConstructorToken
                    let instance = Gradients.new(...args);
                    this.ptr = instance.ptr;
                }
            free() {
                const ptr = this.ptr;
                this.ptr = 0;
                wasm.__wbg_gradients_free(ptr);
            }
        static new() {
    return Gradients.__construct(wasm.gradients_new());
}
static bw() {
    return Gradients.__construct(wasm.gradients_bw());
}
clear() {
    return wasm.gradients_clear(this.ptr);
}
add(arg0, arg1, arg2, arg3) {
    return wasm.gradients_add(this.ptr, arg0, arg1, arg2, arg3);
}
colour_at(arg0) {
    return Colour.__construct(wasm.gradients_colour_at(this.ptr, arg0));
}
}

__exports.Renderer = class Renderer {

                static __construct(ptr) {
                    return new Renderer(new ConstructorToken(ptr));
                }

                constructor(...args) {
                    if (args.length === 1 && args[0] instanceof ConstructorToken) {
                        this.ptr = args[0].ptr;
                        return;
                    }

                    // This invocation of new will call this constructor with a ConstructorToken
                    let instance = Renderer.new(...args);
                    this.ptr = instance.ptr;
                }
            free() {
                const ptr = this.ptr;
                this.ptr = 0;
                wasm.__wbg_renderer_free(ptr);
            }
        static new() {
    return Renderer.__construct(wasm.renderer_new());
}
set_name(arg0) {
    const [ptr0, len0] = passStringToWasm(arg0);
    setGlobalArgument(len0, 0);
    return wasm.renderer_set_name(this.ptr, ptr0);
}
set_gradients(arg0) {
    const ptr0 = arg0.ptr;
    arg0.ptr = 0;
    return wasm.renderer_set_gradients(this.ptr, ptr0);
}
set_max_iterations(arg0) {
    return wasm.renderer_set_max_iterations(this.ptr, arg0);
}
set_escape_radius(arg0) {
    return wasm.renderer_set_escape_radius(this.ptr, arg0);
}
render(arg0) {
    const ptr0 = arg0.ptr;
    arg0.ptr = 0;
    return wasm.renderer_render(this.ptr, ptr0);
}
output_len() {
    return wasm.renderer_output_len(this.ptr);
}
output_ptr() {
    return wasm.renderer_output_ptr(this.ptr);
}
}

__exports.Colour = class Colour {

                static __construct(ptr) {
                    return new Colour(new ConstructorToken(ptr));
                }

                constructor(...args) {
                    if (args.length === 1 && args[0] instanceof ConstructorToken) {
                        this.ptr = args[0].ptr;
                        return;
                    }

                    // This invocation of new will call this constructor with a ConstructorToken
                    let instance = Colour.new(...args);
                    this.ptr = instance.ptr;
                }
            free() {
                const ptr = this.ptr;
                this.ptr = 0;
                wasm.__wbg_colour_free(ptr);
            }
        static new(arg0, arg1, arg2) {
    return Colour.__construct(wasm.colour_new(arg0, arg1, arg2));
}
}

__exports.__wbindgen_throw = function(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}

__exports.__wbindgen_round = function(x) { return Math.round(x); }

__exports.__wbindgen_log2 = function(x) { return Math.log2(x); }

                    function init(wasm_path) {
                        return fetch(wasm_path)
                            .then(response => response.arrayBuffer())
                            .then(buffer => WebAssembly.instantiate(buffer, { './wasm_fractal': __exports }))
                            .then(({instance}) => {
                                wasm = init.wasm = instance.exports;
                                return;
                            });
                    };
                    self.wasmFractal = Object.assign(init, __exports);
                })();
            