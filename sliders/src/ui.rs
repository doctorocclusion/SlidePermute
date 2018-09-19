use stdweb::web::*;
use stdweb::web::event::*;
use stdweb::web::html_element::*;
use stdweb::unstable::TryInto;

use std::rc::Rc;
use std::cell::RefCell;
use std::str::FromStr;

use ::core;

pub struct Data {
    pub number: u32,
    pub num_display: Element,
    pub order_display: Element,
    pub cycles_display: Element,
    pub content_display: Element,
    pub doc: Document,
}

pub fn num_bar<I: IntoIterator<Item=u32>>(data: &Data, nums: I) -> Element {
    let bar = data.doc.create_element("div").unwrap();
    bar.class_list().add("item").unwrap();
    let mut tail = false;
    for num in nums {
        if tail {
            let divider = data.doc.create_element("span").unwrap();
            divider.class_list().add("divider").unwrap();
            bar.append_child(&divider);
        } else { tail = true }
        let text = data.doc.create_text_node(&format!("{}", num));
        bar.append_child(&text);
    }
    bar
}

pub fn go(data: &Data) {
    let info = core::info(data.number);
    data.num_display.set_text_content(&format!("{} Elements", info.n));
    data.order_display.set_text_content(&format!("Order of {}", info.order));
    data.cycles_display.set_text_content(&format!("{} Cycles", info.cycles.len()));
    while let Some(el) = data.content_display.last_child() {
        data.content_display.remove_child(&el);
    }
    for cycle in info.cycles {
        let bar = num_bar(data, cycle);
        data.content_display.append_child(&bar);
    }
}

pub fn update_number(data: &mut Data, input: &InputElement, allow_empty: bool) {
    let val = &input.raw_value();
    if val.is_empty() && allow_empty { return }
    match u32::from_str(val) {
        Ok(n) => {
            data.number = n;
            input.class_list().remove("-error").unwrap();
        },
        Err(_) => input.class_list().add("-error").unwrap(),
    }
}

pub fn attach(doc: Document) {
    let go_button = doc.get_element_by_id("go").unwrap();
    let number_in: InputElement = doc.get_element_by_id("number").unwrap().try_into().unwrap();

    let num_display = doc.get_element_by_id("num").unwrap();
    let order_display = doc.get_element_by_id("order").unwrap();
    let cycles_display = doc.get_element_by_id("cycles").unwrap();
    let content_display = doc.get_element_by_id("content").unwrap();

    let main_data = Rc::new(RefCell::new(Data {
        number: 11,
        num_display,
        order_display,
        cycles_display,
        content_display,
        doc,
    }));

    let data = main_data.clone();
    let input = number_in.clone();
    number_in.add_event_listener(move |_: InputEvent| {
        update_number(&mut *data.borrow_mut(), &input, false);

    });

    let data = main_data.clone();
    go_button.add_event_listener(move |_: ClickEvent| {
        go(&*data.borrow());
    });

    update_number(&mut *main_data.borrow_mut(), &number_in, true);
    go(&*main_data.borrow());
}
