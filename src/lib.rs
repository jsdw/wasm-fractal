#![feature(proc_macro, wasm_custom_section, wasm_import_module)]

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    fn log(s: &str);
    fn error(e: &str);
}

macro_rules! log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}
macro_rules! error {
    ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Colour {
    at: f64,
    red: f64,
    green: f64,
    blue: f64
}

#[wasm_bindgen]
impl Colour {
    pub fn at_rgb(at: f64, r: f64, g: f64, b: f64) -> Colour {
        Colour {
            at: at,
            red: r,
            green: g,
            blue: b
        }
    }
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Opts {
    id: usize,
    height: usize,
    width: usize,
    top: f64,
    left: f64,
    bottom: f64,
    right: f64,
    colours: Vec<Colour>
}

#[wasm_bindgen]
impl Opts {
    pub fn new(id: usize) -> Opts {
        Opts {
            id: id,
            height: 0,
            width: 0,
            top: 0.0,
            left: 0.0,
            bottom: 0.0,
            right: 0.0,
            colours: vec![]
        }
    }
    pub fn set_width(&mut self, val: usize) {
        self.width = val;
    }
    pub fn set_height(&mut self, val: usize) {
        self.height = val;
    }
    pub fn set_top(&mut self, val: f64) {
        self.top = val;
    }
    pub fn set_left(&mut self, val: f64) {
        self.left = val;
    }
    pub fn set_bottom(&mut self, val: f64) {
        self.bottom = val;
    }
    pub fn set_right(&mut self, val: f64) {
        self.right = val;
    }
    pub fn push_colour(&mut self, val: Colour) {
        self.colours.push(val);
    }
}

#[wasm_bindgen]
pub fn render(opts: &Opts) {
    log!("rendering opts: {:?}!", opts);
}