#![feature(proc_macro, wasm_custom_section, wasm_import_module)]

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    #[allow(dead_code)]
    fn log(s: &str);
    #[allow(dead_code)]
    fn error(e: &str);
}

#[allow(unused_macros)]
macro_rules! log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[allow(unused_macros)]
macro_rules! error {
    ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Renderer {
    name: String,
    gradients: Vec<Gradient>,
    output: Vec<Colour>
}

#[wasm_bindgen]
impl Renderer {

    #[wasm_bindgen(constructor)]
    pub fn new() -> Renderer {
        Renderer {
            name: String::new(),
            gradients: vec![
                Gradient{ at: 0.0, red: 0.0, green: 0.0, blue: 0.0 },
                Gradient{ at: 1.0, red: 255.0, green: 255.0, blue: 255.0 }
            ],
            output: vec![]
        }
    }

    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    pub fn clear_gradients(&mut self) {
        self.gradients = vec![];
    }

    pub fn push_gradient(&mut self, gradient: Gradient) {
        self.gradients.push(gradient);
    }

    pub fn render(&mut self, opts: Opts) {
        log!("renderer {} rendering opts: {:?}", self.name, opts);
    }

}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Gradient {
    at: f64,
    red: f64,
    green: f64,
    blue: f64
}

#[wasm_bindgen]
impl Gradient {

    #[wasm_bindgen(constructor)]
    pub fn new(at: f64, r: f64, g: f64, b: f64) -> Gradient {
        Gradient {
            at: at,
            red: r,
            green: g,
            blue: b
        }
    }

}

#[wasm_bindgen]
#[derive(Debug)]
#[repr(C)]
pub struct Colour {
    red: u8,
    green: u8,
    blue: u8
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Opts {
    height: usize,
    width: usize,
    top: f64,
    left: f64,
    bottom: f64,
    right: f64
}

#[wasm_bindgen]
impl Opts {

    #[wasm_bindgen(constructor)]
    pub fn new() -> Opts {
        Opts {
            height: 0,
            width: 0,
            top: 0.0,
            left: 0.0,
            bottom: 0.0,
            right: 0.0
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

}