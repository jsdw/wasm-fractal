(function() {
    const __exports = {};
    let wasm;

    let WASM_VECTOR_LEN = 0;

    let cachedTextEncoder = new TextEncoder('utf-8');

    let cachegetUint8Memory = null;
    function getUint8Memory() {
        if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory;
    }

    let passStringToWasm;
    if (typeof cachedTextEncoder.encodeInto === 'function') {
        passStringToWasm = function(arg) {

            let size = arg.length;
            let ptr = wasm.__wbindgen_malloc(size);
            let writeOffset = 0;
            while (true) {
                const view = getUint8Memory().subarray(ptr + writeOffset, ptr + size);
                const { read, written } = cachedTextEncoder.encodeInto(arg, view);
                writeOffset += written;
                if (read === arg.length) {
                    break;
                }
                arg = arg.substring(read);
                ptr = wasm.__wbindgen_realloc(ptr, size, size += arg.length * 3);
            }
            WASM_VECTOR_LEN = writeOffset;
            return ptr;
        };
    } else {
        passStringToWasm = function(arg) {

            const buf = cachedTextEncoder.encode(arg);
            const ptr = wasm.__wbindgen_malloc(buf.length);
            getUint8Memory().set(buf, ptr);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        };
    }

    let cachedTextDecoder = new TextDecoder('utf-8');

    function getStringFromWasm(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
    }

    __exports.__wbindgen_throw = function(ptr, len) {
        throw new Error(getStringFromWasm(ptr, len));
    };

    function freeColour(ptr) {

        wasm.__wbg_colour_free(ptr);
    }
    /**
    */
    class Colour {

        static __wrap(ptr) {
            const obj = Object.create(Colour.prototype);
            obj.ptr = ptr;

            return obj;
        }

        free() {
            const ptr = this.ptr;
            this.ptr = 0;
            freeColour(ptr);
        }

        /**
        * @param {number} red
        * @param {number} green
        * @param {number} blue
        * @returns {}
        */
        constructor(red, green, blue) {
            this.ptr = wasm.colour_new(red, green, blue);
        }
    }
    __exports.Colour = Colour;

    function freeGradients(ptr) {

        wasm.__wbg_gradients_free(ptr);
    }
    /**
    */
    class Gradients {

        static __wrap(ptr) {
            const obj = Object.create(Gradients.prototype);
            obj.ptr = ptr;

            return obj;
        }

        free() {
            const ptr = this.ptr;
            this.ptr = 0;
            freeGradients(ptr);
        }

        /**
        * @returns {}
        */
        constructor() {
            this.ptr = wasm.gradients_new();
        }
        /**
        * @returns {Gradients}
        */
        static bw() {
            return Gradients.__wrap(wasm.gradients_bw());
        }
        /**
        * @returns {void}
        */
        clear() {
            return wasm.gradients_clear(this.ptr);
        }
        /**
        * @param {number} at
        * @param {number} red
        * @param {number} green
        * @param {number} blue
        * @returns {void}
        */
        add(at, red, green, blue) {
            return wasm.gradients_add(this.ptr, at, red, green, blue);
        }
        /**
        * @param {number} at
        * @returns {Colour}
        */
        colour_at(at) {
            return Colour.__wrap(wasm.gradients_colour_at(this.ptr, at));
        }
    }
    __exports.Gradients = Gradients;

    function freeOpts(ptr) {

        wasm.__wbg_opts_free(ptr);
    }
    /**
    */
    class Opts {

        free() {
            const ptr = this.ptr;
            this.ptr = 0;
            freeOpts(ptr);
        }

        /**
        * @returns {}
        */
        constructor() {
            this.ptr = wasm.opts_new();
        }
        /**
        * @param {number} val
        * @returns {void}
        */
        set_width(val) {
            return wasm.opts_set_width(this.ptr, val);
        }
        /**
        * @param {number} val
        * @returns {void}
        */
        set_height(val) {
            return wasm.opts_set_height(this.ptr, val);
        }
        /**
        * @param {number} val
        * @returns {void}
        */
        set_top(val) {
            return wasm.opts_set_top(this.ptr, val);
        }
        /**
        * @param {number} val
        * @returns {void}
        */
        set_left(val) {
            return wasm.opts_set_left(this.ptr, val);
        }
        /**
        * @param {number} val
        * @returns {void}
        */
        set_bottom(val) {
            return wasm.opts_set_bottom(this.ptr, val);
        }
        /**
        * @param {number} val
        * @returns {void}
        */
        set_right(val) {
            return wasm.opts_set_right(this.ptr, val);
        }
    }
    __exports.Opts = Opts;

    function freeRenderer(ptr) {

        wasm.__wbg_renderer_free(ptr);
    }
    /**
    */
    class Renderer {

        free() {
            const ptr = this.ptr;
            this.ptr = 0;
            freeRenderer(ptr);
        }

        /**
        * @returns {}
        */
        constructor() {
            this.ptr = wasm.renderer_new();
        }
        /**
        * @param {string} name
        * @returns {void}
        */
        set_name(name) {
            const ptr0 = passStringToWasm(name);
            const len0 = WASM_VECTOR_LEN;
            return wasm.renderer_set_name(this.ptr, ptr0, len0);
        }
        /**
        * @param {Gradients} gradients
        * @returns {void}
        */
        set_gradients(gradients) {
            const ptr0 = gradients.ptr;
            gradients.ptr = 0;
            return wasm.renderer_set_gradients(this.ptr, ptr0);
        }
        /**
        * @param {number} mi
        * @returns {void}
        */
        set_max_iterations(mi) {
            return wasm.renderer_set_max_iterations(this.ptr, mi);
        }
        /**
        * @param {number} er
        * @returns {void}
        */
        set_escape_radius(er) {
            return wasm.renderer_set_escape_radius(this.ptr, er);
        }
        /**
        * @param {Opts} opts
        * @returns {void}
        */
        render(opts) {
            const ptr0 = opts.ptr;
            opts.ptr = 0;
            return wasm.renderer_render(this.ptr, ptr0);
        }
        /**
        * @returns {number}
        */
        output_len() {
            return wasm.renderer_output_len(this.ptr) >>> 0;
        }
        /**
        * @returns {number}
        */
        output_ptr() {
            return wasm.renderer_output_ptr(this.ptr);
        }
    }
    __exports.Renderer = Renderer;

    const heap = new Array(32);

    heap.fill(undefined);

    heap.push(undefined, null, true, false);

    let heap_next = heap.length;

    function dropObject(idx) {
        if (idx < 36) return;
        heap[idx] = heap_next;
        heap_next = idx;
    }

    __exports.__wbindgen_object_drop_ref = function(i) { dropObject(i); };

    function init(module) {
        let result;
        const imports = { './wasm_fractal': __exports };
        if (module instanceof URL || typeof module === 'string' || module instanceof Request) {

            const response = fetch(module);
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                result = WebAssembly.instantiateStreaming(response, imports)
                .catch(e => {
                    console.warn("`WebAssembly.instantiateStreaming` failed. Assuming this is because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                    return response
                    .then(r => r.arrayBuffer())
                    .then(bytes => WebAssembly.instantiate(bytes, imports));
                });
            } else {
                result = response
                .then(r => r.arrayBuffer())
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            }
        } else {

            result = WebAssembly.instantiate(module, imports)
            .then(result => {
                if (result instanceof WebAssembly.Instance) {
                    return { instance: result, module };
                } else {
                    return result;
                }
            });
        }
        return result.then(({instance, module}) => {
            wasm = instance.exports;
            init.__wbindgen_wasm_module = module;

            return wasm;
        });
    }

    self.wasmFractal = Object.assign(init, __exports);

})();
