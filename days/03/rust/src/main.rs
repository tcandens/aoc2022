use std::io::{self, prelude::*, BufReader};
use std::collections::HashMap;
use std::fs::File;

fn main() -> io::Result<()> {
    let file = File::open("input.txt")?;
    let reader = BufReader::new(file);

    let mut all_duplicates: Vec<u8> = vec![];

    for line in reader.lines() {
        let rline = line.expect("line should be a string");
        let linebytes = rline.as_bytes();
        let rline_len = rline.len();
        let mut first_part: HashMap<u8, bool> = HashMap::new();
        let mut second_part: HashMap<u8, bool> = HashMap::new();
        let mut rline_duplicates: Vec<u8> = vec![];
        for (i, &byte) in linebytes.iter().enumerate() {
            if i < rline_len / 2 {
                first_part.insert(byte, true);
            } else {
                let found = first_part.contains_key(&byte);
                let already_found = second_part.contains_key(&byte);
                if found && !already_found {
                    second_part.insert(byte, true);
                    rline_duplicates.push(byte);
                }
            }
        }
        all_duplicates.append(&mut rline_duplicates);
    }

    let mut total: u16 = 0;

    for byte in all_duplicates {
        if byte < 91 {
            let priority: u16 = (byte - 38).into();
            total = total + priority;
        } else {
            let priority: u16 = (byte - 96).into();
            total = total + priority;
        }
    }

    println!("total: {}", total);

    Ok(())
}