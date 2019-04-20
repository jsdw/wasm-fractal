#!/bin/bash

# exit on first sign of error:
set -e

# nabbed from SO; cd to directory project lives in:
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# update (in release mode) the wasm:
cargo build --release --target wasm32-unknown-unknown

# update the wasm bindings:
wasm-bindgen target/wasm32-unknown-unknown/release/wasm_fractal.wasm \
    --no-modules \
    --no-modules-global wasmFractal \
    --no-typescript \
    --out-dir js