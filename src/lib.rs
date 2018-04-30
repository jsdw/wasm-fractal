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
    output: Vec<Colour>
}

#[wasm_bindgen]
impl Renderer {

    #[wasm_bindgen(constructor)]
    pub fn new() -> Renderer {
        Renderer {
            name: String::new(),
            gradients: Gradients::bw(),
            output: vec![]
        }
    }

    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    pub fn set_gradients(&mut self, gradients: Gradients) {
        self.gradients = gradients;
    }

    pub fn render(&mut self, opts: Opts) {
        log!("renderer {} rendering opts: {:?}", self.name, opts);

        // clear the allocated output space for reuse:
        self.output.clear();

        let horizontal_step = (opts.right - opts.left) / opts.width as f64;
        let vertical_step = (opts.bottom - opts.top) / opts.height as f64;

        let x_start = opts.left + (horizontal_step / 2.0);
        let y_start = opts.right + (vertical_step / 2.0);

        let fractal_opts = fractal::Opts {
            max_iterations: 100.0,
            escape_radius: 10.0
        };

        let mut y = y_start;
        while y < opts.bottom {

            let mut x = x_start;
            while x < opts.right {

                let iters = fractal::iterations(&fractal_opts, 0.0, 0.0, x, y);
                let colour = self.gradients.colour_at(iters / fractal_opts.max_iterations);
                self.output.push(colour);

                x += horizontal_step;
            }

            y += vertical_step;

        }

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
            return Colour { red: 0, green: 0, blue: 0 }
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
                let dist = at / (g2.at - g1.at);

                let red = (g2.red - g1.red) * dist + g1.red;
                let green = (g2.green - g1.green) * dist + g1.green;
                let blue = (g2.blue - g1.blue) * dist + g1.blue;

                return Colour {
                    red: red.round() as u8,
                    green: green.round() as u8,
                    blue: blue.round() as u8
                }
            }
        }

        return Colour { red: 0, green: 0, blue: 0 }

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
            red: self.red as u8,
            green: self.green as u8,
            blue: self.blue as u8
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