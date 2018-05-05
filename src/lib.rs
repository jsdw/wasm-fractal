#![feature(proc_macro, wasm_custom_section, wasm_import_module)]

extern crate wasm_bindgen;

mod fractal;

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
    gradients: Gradients,
    max_iterations: isize,
    escape_radius: f64,
    output: Vec<Colour>
}

#[wasm_bindgen]
impl Renderer {

    #[wasm_bindgen(constructor)]
    pub fn new() -> Renderer {
        Renderer {
            name: String::new(),
            gradients: Gradients::bw(),
            max_iterations: 500,
            escape_radius: 10.0,
            output: vec![]
        }
    }

    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    pub fn set_gradients(&mut self, gradients: Gradients) {
        self.gradients = gradients;
    }

    pub fn set_max_iterations(&mut self, mi: isize) {
        self.max_iterations = mi;
    }

    pub fn set_escape_radius(&mut self, er: f64) {
        self.escape_radius = er;
    }

    pub fn render(&mut self, opts: Opts) {

        // clear the allocated output space for reuse:
        self.output.clear();

        let horizontal_step = (opts.right - opts.left) / opts.width as f64;
        let vertical_step = (opts.bottom - opts.top) / opts.height as f64;

        let x_start = opts.left + (horizontal_step / 2.0);
        let y_start = opts.top + (vertical_step / 2.0);

        let fractal_opts = fractal::Opts {
            max_iterations: self.max_iterations,
            escape_radius: self.escape_radius
        };

        let mi = self.max_iterations as f64;

        // we make sure to iterate exactly width*height times, and increment
        // the coords as we go to render each pixel.
        let mut y_coord = y_start;
        for _y in 0..opts.height {

            let mut x_coord = x_start;
            for _x in 0..opts.width {

                let iters = fractal::iterations(&fractal_opts, 0.0, 0.0, x_coord, y_coord);
                let colour = self.gradients.colour_at(iters / mi);

                self.output.push(colour);

                x_coord += horizontal_step;

            }

            y_coord += vertical_step;

        }

    }

    // These allow us to create a UInt8Array in JS to view the colours
    // without performing a copy:
    pub fn output_len(&self) -> usize {
        self.output.len() * 4
    }
    pub fn output_ptr(&self) -> *const u8 {
        self.output.as_ptr() as *const u8
    }

}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Gradients {
    gradients: Vec<Gradient>
}

#[wasm_bindgen]
impl Gradients {

    #[wasm_bindgen(constructor)]
    pub fn new() -> Gradients {
        Gradients {
            gradients: vec![]
        }
    }

    pub fn bw() -> Gradients {
        let mut g = Gradients::new();
        g.add(0.0, 0.0, 0.0, 0.0);
        g.add(1.0, 255.0, 255.0, 255.0);
        g
    }

    pub fn clear(&mut self) {
        self.gradients.clear();
    }

    pub fn add(&mut self, at: f64, red: f64, green: f64, blue: f64) {
        self.gradients.push(Gradient { at, red, green, blue });
        self.gradients.sort_by(|a, b| a.at.partial_cmp(&b.at).unwrap());
    }

    pub fn colour_at(&self, at: f64) -> Colour {

        if self.gradients.len() == 0 {
            return Colour::new(0,0,0)
        }

        if self.gradients.len() == 1 {
            return self.gradients[0].to_colour();
        }

        let first = self.gradients.first().unwrap();
        if at <= first.at {
            return first.to_colour();
        }

        let last = self.gradients.last().unwrap();
        if at >= last.at {
            return last.to_colour();
        }

        for w in self.gradients.windows(2) {
            let g1 = &w[0];
            let g2 = &w[1];

            if at >= g1.at && at <= g2.at {
                let range = g2.at - g1.at;
                let dist = (at - g1.at) / range;

                let red = (g2.red - g1.red) * dist + g1.red;
                let green = (g2.green - g1.green) * dist + g1.green;
                let blue = (g2.blue - g1.blue) * dist + g1.blue;

                return Colour::new(
                    red.round() as u8,
                    green.round() as u8,
                    blue.round() as u8
                )
            }
        }

        return Colour::new(0,0,0)

    }

}

#[derive(Debug)]
pub struct Gradient {
    at: f64,
    red: f64,
    green: f64,
    blue: f64
}

impl Gradient {
    fn to_colour(&self) -> Colour {
        Colour {
            red: self.red.round() as u8,
            green: self.green.round() as u8,
            blue: self.blue.round() as u8,
            alpha: 255
        }
    }
}

#[wasm_bindgen]
#[derive(Debug)]
#[repr(C)]
pub struct Colour {
    red: u8,
    green: u8,
    blue: u8,
    // Having this aligns with ImageData on the JS,
    // though we don't make use of it here:
    alpha: u8
}

#[wasm_bindgen]
impl Colour {

    #[wasm_bindgen(constructor)]
    pub fn new(red: u8, green: u8, blue: u8) -> Colour {
        Colour { red, green, blue, alpha: 255 }
    }

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