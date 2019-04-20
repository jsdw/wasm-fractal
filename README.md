# WASM Fractal Generator

View it [here](https://jsdw.github.io/wasm-fractal) (Requires a browser that supports WASM: Edge 16+, Firefox 53+, Chrome 57+, Safari 11+).

A Fractal generator written in Rust + JavaScript.

The Rust code is compiled to WASM and is the heart of the fractal generator. The main thread queues up work to hand out to multiple Web Workers, who themselves instantiate and run WASM to generate the resulting data, which is then sent back to the main thread to be splatted onto one of a few canvases to progressively render from low to retina quality resolution.

There are a couple of things that can be tweaked/obtained in the console (iters is the main one).

# Compiling

This should run fine on recent stable versions of Rust, and has most recently been tested on `rustc` version `1.34.0`.

```
# add our wasm build target:
rustup target add wasm32-unknown-unknown

# install the bindgen cli tool to generate js<->wasm bindings
# (matching the version of the wasm-bindgen library in Cargo.toml).
# add --force to override an existing installed version:
cargo install wasm-bindgen-cli --version 0.2.42
```

From there, running the following in the root directory of the project builds it (in release mode) and generates the js bindings to the wasm:

```
cargo build --release --target wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/release/wasm_fractal.wasm \
    --no-modules \
    --no-modules-global wasmFractal \
    --no-typescript \
    --out-dir js
```

Alternately, just run `./make_wasm.sh`, which does the same.

# FAQ

If you run into any issues:

- make sure that running `wasm-bindgen --version` returns `0.2.42`.
- `rm -rf target` and try building again