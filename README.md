# WASM Fractal Generator

A Fractal generator written in Rust + JavaScript. Requires a browser that supports WASM (Edge 16+, Firefox 53+, Chrome 57+, Safari 11+).

The Rust code is compiled to WASM and is the heart of the fractal generator. The main thread queues up work to hand out to multiple Web Workers, who themselves instantiate and run WASM to generate the resulting data, which is then sent back to the main thread to be splatted onto one of a few canvases, set up for low, medium, high and retina renderings.

Go [here](https://jsdw.github.io/wasm-fractal) to check it out. There are a couple of things that can be tweaked/obtained in the console (iters is the main one).

# Compiling

We need nightly Rust (at present) for this to work. The following steps need running once to set everything up:

```
# install the nightly toolchain:
rustup install nightly

# use the nightly toolchain. can go back to stable with 'rustup default stable'
rustup default nightly

# add our wasm build target:
rustup target add wasm32-unknown-unknown

# install the bindgen cli tool (I used 0.2.7) to generate js<->wasm bindings:
cargo install wasm-bindgen-cli
```

From there, running the following in the root directory of the project builds it (in release mode) and generates the js bindings to the wasm:

```
cargo build --release --target wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/release/wasm_fractal.wasm --no-modules --no-modules-global wasmFractal --no-typescript --out-dir js
```