import fs from "node:fs/promises";
import path from "node:path";

let priorities = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

async function main() {
  const datapath = path.resolve(__dirname, "input.txt");
  const file = await fs.open(datapath);

  let duplicates = "";

  for await (let line of file.readLines()) {
    line = line.trim();
    let firstMap = new Map();
    let lineDupes = "";
    for (let i = 0; i < line.length; i++) {
      let char = line.charAt(i);
      if (i < line.length / 2) {
        firstMap.set(char, true);
      } else {
        let found = firstMap.has(char);
        if (found && lineDupes.indexOf(char) == -1) {
          lineDupes = lineDupes.concat(char);
        }
      }
    }
    duplicates = duplicates.concat(lineDupes);
  }

  const total = duplicates.split("").reduce((acc, curr) => {
    let val = priorities.indexOf(curr) + 1;
    // console.log(`dupe: ${curr}; val: ${val}`);
    acc += val;
    return acc;
  }, 0);

  return total;
}

main().then((total) => console.log(`priority totals: ${total}`));
