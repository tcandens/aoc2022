use std::fs::File;
use std::io::{self, prelude::*, BufReader};

fn main() -> io::Result<()> {
    let file = File::open("input.txt")?;
    let reader = BufReader::new(file);

    let mut elves = Vec::new();
    let mut calories: i32 = 0;

    for line in reader.lines() {
        let _: i32 = match line?.trim().parse() {
            Ok(num) => {
                calories += num;
                num
            },
            Err(_) => {
                elves.push(calories);
                calories = 0;
                continue
            },
        };
    }

    elves.sort_by(|a, b| b.cmp(a));

    let mut total: i32 = 0;
    for i in 0..3 {
        total += elves[i];
    }

    println!("top three total: {}", total);
    println!("largest: {}", elves[0]);

    Ok(())
}