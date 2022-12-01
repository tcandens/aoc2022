import path from "node:path";
import fs from "node:fs/promises";

async function main() {
  const datapath = path.resolve(__dirname, "../input.txt");
  const file = await fs.open(datapath);
  // const stream = file.createReadStream();

  let elves: number[] = [];
  let currentElfCalories = 0;

  for await (const chunk of file.readLines()) {
    if (!chunk) {
      elves.push(currentElfCalories);
      currentElfCalories = 0;
      continue;
    }

    let value = parseInt(chunk);
    currentElfCalories += value;
  }

  elves.sort((a, b) => b - a);

  const topThree = elves.slice(0, 3);
  return topThree.reduce((acc, curr) => {
    acc += curr;
    return acc;
  }, 0);
}

main().then((total) => {
  console.log(total);
  // console.log(`Maximum: ${max} at ${idx}`);
});
