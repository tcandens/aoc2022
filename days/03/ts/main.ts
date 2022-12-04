import fs from "node:fs/promises";
import path from "node:path";

const group_size = 3;

function utf8_byte_to_priority(byte: number) {
  if (byte < 91) {
    return byte - 38;
  } else {
    return byte - 96;
  }
}

async function main() {
  const datapath = path.resolve(__dirname, "input.txt");
  const file = await fs.open(datapath);

  let group_totals = 0;
  let group_bytes = new Map();
  let line_number = 0;

  for await (let line of file.readLines()) {
    line = line.trim();
    let group_index = line_number % group_size;

    for (let i = 0; i < line.length; i++) {
      let byte = line.charCodeAt(i);
      let current = group_bytes.get(byte);
      if (!current) {
        group_bytes.set(byte, [group_index]);
      } else if (Array.isArray(current) && !current.includes(group_index)) {
        group_bytes.set(byte, [...current, group_index]);
      }
    }

    if (line_number > 0 && group_index === group_size - 1) {
      // last line of three person group let check group bytes
      for (let [byte, state] of group_bytes.entries()) {
        if (Array.isArray(state) && state.length === group_size) {
          let priority = utf8_byte_to_priority(byte);
          group_totals += priority;
        }
      }

      // reset groups
      group_bytes = new Map();
    }

    line_number++;
  }

  return group_totals;
}

main().then((total) => console.log(`priority totals: ${total}`));
