(function() {
    var wasm;
    const __exports = {};


    let cachedEncoder = new TextEncoder('utf-8');

    let cachegetUint8Memory = null;
    function getUint8Memory() {
        if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory;
    }

    function passStringToWasm(arg) {

        const buf = cachedEncoder.encode(arg);
        const ptr = wasm.__wbindgen_malloc(buf.length);
        getUint8Memory().set(buf, ptr);
        return [ptr, buf.length];
    }

    class ConstructorToken {
        constructor(ptr) {
            this.ptr = ptr;
        }
    }

    function freeGradients(ptr) {

        wasm.__wbg_gradients_free(ptr);
    }
    /**
    */
    class Gradients {

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
            freeGradients(ptr);
        }
        /**
        * @returns {Gradients}
        */
        static new() {
            return Gradients.__construct(wasm.gradients_new());
        }
        /**
        * @returns {Gradients}
        */
        static bw() {
            return Gradients.__construct(wasm.gradients_bw());
        }
        /**
        * @returns {void}
        */
        clear() {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return wasm.gradients_clear(this.ptr);
        }
        /**
        * @param {number} arg0
        * @param {number} arg1
        * @param {number} arg2
        * @param {number} arg3
        * @returns {void}
        */
        add(arg0, arg1, arg2, arg3) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return wasm.gradients_add(this.ptr, arg0, arg1, arg2, arg3);
        }
        /**
        * @param {number} arg0
        * @returns {Colour}
        */
        colour_at(arg0) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return Colour.__construct(wasm.gradients_colour_at(this.ptr, arg0));
        }
    }
    __exports.Gradients = Gradients;

    function freeColour(ptr) {

        wasm.__wbg_colour_free(ptr);
    }
    /**
    */
    class Colour {

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
            freeColour(ptr);
        }
        /**
        * @param {number} arg0
        * @param {number} arg1
        * @param {number} arg2
        * @returns {Colour}
        */
        static new(arg0, arg1, arg2) {
            return Colour.__construct(wasm.colour_new(arg0, arg1, arg2));
        }
    }
    __exports.Colour = Colour;

    function freeOpts(ptr) {

        wasm.__wbg_opts_free(ptr);
    }
    /**
    */
    class Opts {

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
            freeOpts(ptr);
        }
        /**
        * @returns {Opts}
        */
        static new() {
            return Opts.__construct(wasm.opts_new());
        }
        /**
        * @param {number} arg0
        * @returns {void}
        */
        set_width(arg0) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return wasm.opts_set_width(this.ptr, arg0);
        }
        /**
        * @param {number} arg0
        * @returns {void}
        */
        set_height(arg0) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return wasm.opts_set_height(this.ptr, arg0);
        }
        /**
        * @param {number} arg0
        * @returns {void}
        */
        set_top(arg0) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return wasm.opts_set_top(this.ptr, arg0);
        }
        /**
        * @param {number} arg0
        * @returns {void}
        */
        set_left(arg0) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return wasm.opts_set_left(this.ptr, arg0);
        }
        /**
        * @param {number} arg0
        * @returns {void}
        */
        set_bottom(arg0) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return wasm.opts_set_bottom(this.ptr, arg0);
        }
        /**
        * @param {number} arg0
        * @returns {void}
        */
        set_right(arg0) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return wasm.opts_set_right(this.ptr, arg0);
        }
    }
    __exports.Opts = Opts;

    function freeRenderer(ptr) {

        wasm.__wbg_renderer_free(ptr);
    }
    /**
    */
    class Renderer {

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
            freeRenderer(ptr);
        }
        /**
        * @returns {Renderer}
        */
        static new() {
            return Renderer.__construct(wasm.renderer_new());
        }
        /**
        * @param {string} arg0
        * @returns {void}
        */
        set_name(arg0) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            const [ptr0, len0] = passStringToWasm(arg0);
            return wasm.renderer_set_name(this.ptr, ptr0, len0);
        }
        /**
        * @param {Gradients} arg0
        * @returns {void}
        */
        set_gradients(arg0) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            const ptr0 = arg0.ptr;
            if (ptr0 === 0) {
                throw new Error('Attempt to use a moved value');
            }
            arg0.ptr = 0;
            return wasm.renderer_set_gradients(this.ptr, ptr0);
        }
        /**
        * @param {number} arg0
        * @returns {void}
        */
        set_max_iterations(arg0) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return wasm.renderer_set_max_iterations(this.ptr, arg0);
        }
        /**
        * @param {number} arg0
        * @returns {void}
        */
        set_escape_radius(arg0) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return wasm.renderer_set_escape_radius(this.ptr, arg0);
        }
        /**
        * @param {Opts} arg0
        * @returns {void}
        */
        render(arg0) {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            const ptr0 = arg0.ptr;
            if (ptr0 === 0) {
                throw new Error('Attempt to use a moved value');
            }
            arg0.ptr = 0;
            return wasm.renderer_render(this.ptr, ptr0);
        }
        /**
        * @returns {number}
        */
        output_len() {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return wasm.renderer_output_len(this.ptr);
        }
        /**
        * @returns {number}
        */
        output_ptr() {
            if (this.ptr === 0) {
                throw new Error('Attempt to use a moved value');
            }
            return wasm.renderer_output_ptr(this.ptr);
        }
    }
    __exports.Renderer = Renderer;

    let cachedDecoder = new TextDecoder('utf-8');

    function getStringFromWasm(ptr, len) {
        return cachedDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
    }

    __exports.__wbindgen_throw = function(ptr, len) {
        throw new Error(getStringFromWasm(ptr, len));
    };

    function init(wasm_path) {
        const fetchPromise = fetch(wasm_path);
        let resultPromise;
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            resultPromise = WebAssembly.instantiateStreaming(fetchPromise, { './wasm_fractal': __exports });
        } else {
            resultPromise = fetchPromise
            .then(response => response.arrayBuffer())
            .then(buffer => WebAssembly.instantiate(buffer, { './wasm_fractal': __exports }));
        }
        return resultPromise.then(({instance}) => {
            wasm = init.wasm = instance.exports;
            return;
        });
    };
    self.wasmFractal = Object.assign(init, __exports);
})();
