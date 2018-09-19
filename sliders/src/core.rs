use num_integer::Integer;
use stdweb::serde::Serde;

#[js_export]
pub fn slide(n: u32) -> Slide {
    let mut out = Slide {
        n,
        cyc: Vec::new(),
    };

    if n == 0 { return out; }

    // list of finished cycles
    // the 0 cycle is always its own length 1 cycle
    out.cyc.push((0, 1));

    // to ensure that our outputted cycles are not duplicated, we will ignore
    // any cycles that do not start on their lowest number (only one such
    // ordering of a given cycle can exist)

    // if first is even, then permute(first) < first
    // if first is odd and greater than 2 * n / 3, then permute(first) < first

    // so we can save time by only starting with the odd numbers less than or equal to 2/3rds n
    'cycles_loop: for start in 0..(n / 3 + 1) {
        let start = start * 2 + 1;
        let mut i = start;

        let mut count = 0u32;

        loop {
            // i is guaranteed to be odd, permute as such
            i = n - (i + 1) / 2;
            count += 1;

            // how many times can i be divided by 2?
            let tz = i.trailing_zeros() as u32;

            i >>= tz; // divide i by 2 until odd
            count += tz; // each one of these divisions is a further step in the cycle

            // this ordering of the cycle did not start with its lowest value
            if i < start { continue 'cycles_loop; }

            // we started with the lowest odd number so we know we did not miss a point when i == start
            if i == start { break; }
        }

        out.cyc.push((start, count));
    }

    out
}

#[derive(Serialize, Deserialize)]
pub struct Slide {
    pub n: u32,
    pub cyc: Vec<(u32, u32)>,
}
js_serializable!(Slide);
js_deserializable!(Slide);

#[derive(Serialize, Deserialize)]
pub struct FullInfo {
    pub n: u32,
    pub order: u32,
    pub cycles: Vec<Vec<u32>>,
}
js_serializable!(FullInfo);

#[inline(always)]
fn next(n: u32, i: u32) -> u32 {
    if i % 2 == 0 { i / 2 }
	else { n - (i + 1) / 2 }
}

#[js_export]
pub fn permutation(n: u32) -> Vec<u32> {
    (0..n).map(|i| next(n, i)).collect()
}

#[js_export]
pub fn order(slide: &Slide) -> u32 {
    let mut o = 1;
    for &(_, l) in &slide.cyc {
        o = o.lcm(&l);
    }
    o
}

#[js_export]
pub fn cycles(slide: &Slide) -> Vec<Vec<u32>> {
    let n = slide.n;
    slide.cyc.iter().map(|&(mut i, o)| {
        let mut cyc = Vec::with_capacity(o as usize);
        for _ in 0..o {
            cyc.push(i);
            i = next(n, i);
        }
        cyc
    }).collect()
}

#[js_export]
pub fn is_prime(n: u32) -> bool {
    for i in 2..n/2 {
        if n % i == 0 { return false }
    }
    true
}

#[js_export]
pub fn info_of(slide: &Slide) -> FullInfo {
    let mut cycles = cycles(slide);
    cycles.sort_by_key(|c| c.len());
    FullInfo {
        n: slide.n,
        order: order(slide),
        cycles: cycles,
    }
}

#[js_export]
pub fn info(n: u32) -> FullInfo {
    info_of(&slide(n))
}

#[js_export]
pub fn infos(start: u32, end: u32) -> Vec<FullInfo> {
    (start..end).map(info).collect()
}

#[js_export]
pub fn orders(start: u32, end: u32) -> Vec<u32> {
    (start..end).map(slide).map(|ref s| order(s)).collect()
}
