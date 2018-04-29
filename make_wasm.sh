#!/bin/bash

# exit on first sign of error:
set -e

# nabbed from SO; cd to directory project lives in:
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# update (in debug mode) the wasm:
cargo build --target wasm32-unknown-unknown

# update the wasm bindings:
wasm-bindgen target/wasm32-unknown-unknown/debug/wasm_fractal.wasm --no-modules --no-modules-global wasmFractal --no-typescript --out-dir js