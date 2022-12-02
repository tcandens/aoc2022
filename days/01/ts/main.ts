import path from "node:path";
import fs from "node:fs/promises";

class BST {
  root: Node | undefined;

  constructor() {}
  insert(value: number, meta?: Record<string, unknown>) {
    let current: Node | undefined;
    let x = this.root;
    const next = new Node(value, meta);

    while (x) {
      current = x;
      if (next.data < x.data) {
        x = x.left;
      } else {
        x = x.right;
      }
    }

    next.parent = current;
    if (!current) {
      this.root = next;
    } else if (next.data < current.data) {
      current.left = next;
    } else {
      current.right = next;
    }
  }
}
class Node {
  data: number;
  meta?: Record<string, unknown>;
  parent?: Node;
  left?: Node;
  right?: Node;
  constructor(value: number, meta?: Record<string, unknown>) {
    this.data = value;
    if (meta) {
      this.meta = meta;
    }
  }
}

async function main() {
  const datapath = path.resolve(__dirname, "../input.txt");
  const file = await fs.open(datapath);

  let elves = new BST();
  let index: number = 0;
  let calories = 0;

  for await (const chunk of file.readLines()) {
    // empty line implies new elf
    if (!chunk) {
      elves.insert(calories, { index });
      calories = 0;
      index += 1;
      continue;
    }

    let value = parseInt(chunk);
    calories += value;
  }

  let total = 0;
  let t = 3;
  function walk(node?: Node) {
    if (node) {
      walk(node.right);
      if (t > 0) {
        total += node.data;
      }
      t = t - 1;
      walk(node.left);
    }
  }
  walk(elves.root);
  return total;
}

main().then((total) => {
  console.log(`top three elves total calories: ${total}`);
});
