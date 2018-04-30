
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

__exports.Gradient = class Gradient {

                static __construct(ptr) {
                    return new Gradient(new ConstructorToken(ptr));
                }

                constructor(...args) {
                    if (args.length === 1 && args[0] instanceof ConstructorToken) {
                        this.ptr = args[0].ptr;
                        return;
                    }

                    // This invocation of new will call this constructor with a ConstructorToken
                    let instance = Gradient.new(...args);
                    this.ptr = instance.ptr;
                }
            free() {
                const ptr = this.ptr;
                this.ptr = 0;
                wasm.__wbg_gradient_free(ptr);
            }
        static new(arg0, arg1, arg2, arg3) {
    return Gradient.__construct(wasm.gradient_new(arg0, arg1, arg2, arg3));
}
}

__exports.Colour = class Colour {

                static __construct(ptr) {
                    return new Colour(ptr);
                }

                constructor(ptr) {
                    this.ptr = ptr;
                }

            free() {
                const ptr = this.ptr;
                this.ptr = 0;
                wasm.__wbg_colour_free(ptr);
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
clear_gradients() {
    return wasm.renderer_clear_gradients(this.ptr);
}
push_gradient(arg0) {
    const ptr0 = arg0.ptr;
    arg0.ptr = 0;
    return wasm.renderer_push_gradient(this.ptr, ptr0);
}
render(arg0) {
    const ptr0 = arg0.ptr;
    arg0.ptr = 0;
    return wasm.renderer_render(this.ptr, ptr0);
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

let slab = [];

let slab_next = 0;

function addHeapObject(obj) {
    if (slab_next === slab.length)
        slab.push(slab.length + 1);
    const idx = slab_next;
    const next = slab[idx];

    slab_next = next;

    slab[idx] = { obj, cnt: 1 };
    return idx << 1;
}

let stack = [];

function getObject(idx) {
    if ((idx & 1) === 1) {
        return stack[idx >> 1];
    } else {
        const val = slab[idx >> 1];

    return val.obj;

    }
}

__exports.__wbindgen_object_clone_ref = function(idx) {
    // If this object is on the stack promote it to the heap.
    if ((idx & 1) === 1)
        return addHeapObject(getObject(idx));

    // Otherwise if the object is on the heap just bump the
    // refcount and move on
    const val = slab[idx >> 1];
    val.cnt += 1;
    return idx;
}

function dropRef(idx) {

    let obj = slab[idx >> 1];

    obj.cnt -= 1;
    if (obj.cnt > 0)
        return;

    // If we hit 0 then free up our space in the slab
    slab[idx >> 1] = slab_next;
    slab_next = idx >> 1;
}

__exports.__wbindgen_object_drop_ref = function(i) { dropRef(i); }

__exports.__wbindgen_string_new = function(p, l) {
    return addHeapObject(getStringFromWasm(p, l));
}

__exports.__wbindgen_number_new = function(i) { return addHeapObject(i); }

__exports.__wbindgen_number_get = function(n, invalid) {
    let obj = getObject(n);
    if (typeof(obj) === 'number')
        return obj;
    getUint8Memory()[invalid] = 1;
    return 0;
}

__exports.__wbindgen_undefined_new = function() { return addHeapObject(undefined); }

__exports.__wbindgen_null_new = function() {
    return addHeapObject(null);
}

__exports.__wbindgen_is_null = function(idx) {
    return getObject(idx) === null ? 1 : 0;
}

__exports.__wbindgen_is_undefined = function(idx) {
    return getObject(idx) === undefined ? 1 : 0;
}

__exports.__wbindgen_boolean_new = function(v) {
    return addHeapObject(v === 1);
}

__exports.__wbindgen_boolean_get = function(i) {
    let v = getObject(i);
    if (typeof(v) === 'boolean') {
        return v ? 1 : 0;
    } else {
        return 2;
    }
}

__exports.__wbindgen_symbol_new = function(ptr, len) {
    let a;
    if (ptr === 0) {
        a = Symbol();
    } else {
        a = Symbol(getStringFromWasm(ptr, len));
    }
    return addHeapObject(a);
}

__exports.__wbindgen_is_symbol = function(i) {
    return typeof(getObject(i)) === 'symbol' ? 1 : 0;
}

__exports.__wbindgen_string_get = function(i, len_ptr) {
    let obj = getObject(i);
    if (typeof(obj) !== 'string')
        return 0;
    const [ptr, len] = passStringToWasm(obj);
    getUint32Memory()[len_ptr / 4] = len;
    return ptr;
}

__exports.__wbindgen_throw = function(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}

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
            