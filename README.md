# WASM Fractal Generator

A Fractal generator written in Rust + JavaScript.

The Rust code is compiled to WASM and is the heart of the fractal generator. Web Workers (WASM doesn't support threads yet) are used to parallelise fractal generation.

Go [here](https://jsdw.github.io/wasm-fractal) to check it out.

# Compiling

We need nightly Rust (at present) for this to work. The following steps need running once to set everything up:

```
# install the nightly toolchain:
rustup install nightly

# use the nightly toolchain. can go back to stable with 'rustup default stable'
rustup default nightly

# add our wasm build target:
rustup target add wasm32-unknown-unknown

# install the bindgen cli tool to generate js<->wasm bindings:
cargo install wasm-bindgen-cli
```

From there, running the following in the root directory of the project builds it (in release mode) and generates the js bindings to the wasm:

```
cargo build --release --target wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/release/wasm_fractal.wasm --no-modules --no-modules-global wasmFractal --no-typescript --out-dir js
```