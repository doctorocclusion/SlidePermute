#![feature(proc_macro)]

#[macro_use]
extern crate stdweb;
#[macro_use]
extern crate serde_derive;
extern crate serde;
extern crate num_integer;

pub mod core;
pub mod ui;

fn main() {
    stdweb::initialize();
    ui::attach(stdweb::web::document());
}
