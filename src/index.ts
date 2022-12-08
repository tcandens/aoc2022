import fs from "node:fs/promises";
import path from "node:path";

class File {
  name: String;
  size: number;
  isDir(): this is Directory {
    return this instanceof Directory;
  }
  isFile(): this is File {
    return this instanceof File;
  }
}

class Directory {
  name: String;
  parent: Directory | undefined;
  children: Map<String, Directory | File>;
  constructor(name: String) {
    this.name = name;
    this.children = new Map();
  }
  pathname() {
    let path_collector: String[] = [];
    let curr = this.parent;
    while (curr) {
      let name = curr.name;
      if (name === "/") {
        name = "";
      }
      path_collector.push(name);
      curr = curr.parent;
    }
    return path_collector.length > 1 ? path_collector.reverse().join("/") : "/";
  }
  isDir(): this is Directory {
    return this instanceof Directory;
  }
  isFile(): this is File {
    return this instanceof File;
  }
  size() {
    let total = 0;
    for (let child of this.children.values()) {
      if (child.isFile()) {
        total += child.size;
      } else if (child.isDir()) {
        let sub = child.size();
        total += sub;
      }
    }
    return total;
  }
  cd(path: String): Directory {
    if (path == "/" && !this.parent) {
      // console.log("starting with root");
      return this;
    }
    if (path == "..") {
      if (!this.parent) {
        console.warn(
          "cannot change to parent directory since it does not exist",
          this.name,
          path
        );
        throw new Error("null parent");
        // return this;
      }
      // console.log("navigating up", this.name, this.parent);
      return this.parent;
    }
    let found = this.children.get(path);
    if (found && found.isDir()) {
      // console.log("found existing dir", path, found);
      return found;
    } else {
      // console.log("creating new directory", path, this);
      const dir = new Directory(path);
      dir.parent = this;
      this.children.set(path, dir);
      return dir;
    }
  }
  touch(name: String, size: number) {
    let f = new File();
    f.name = name;
    f.size = size;
    this.children.set(name, f);
  }
}

function visit<T extends File | Directory>(node: T, visitor: (n: T) => void) {
  visitor(node);
  if (node.isDir()) {
    for (let child of node.children.values()) {
      visit(child as T, visitor);
    }
  }
}

async function buildTreeFromFileHandle(file: Promise<fs.FileHandle>) {
  const root = new Directory("/");
  let currentDir = root;
  let isListingDirectory = false;

  let idx = 0;

  for await (let line of (await file).readLines()) {
    try {
      const match_command = /^\$\s(.*)/.exec(line);
      if (isListingDirectory && !match_command) {
        const [size, name] = line.split(" ");
        if (size !== "dir") {
          currentDir.touch(name, parseInt(size));
        } else {
          // console.log("listing dir, no-op", size, name);
        }
      } else if (match_command) {
        if (isListingDirectory) {
          isListingDirectory = false;
        }
        const [raw, raw_cmd] = match_command;
        const cmd = raw_cmd.split(" ");
        switch (cmd[0]) {
          case "cd": {
            currentDir = currentDir.cd(cmd[1]);
            break;
          }
          case "ls": {
            isListingDirectory = true;
          }
        }
      } else {
        throw new Error("undefined behavior");
      }
    } catch (e) {
      console.error(`error at line ${idx}`);
      console.error(e);
      throw e;
    }
    // console.log({ idx, currentDir });
    idx++;
  }

  return root;
}

async function part_one() {
  const file = fs.open(path.resolve(__dirname, "../data", "d07.txt"));
  const dir = await buildTreeFromFileHandle(file);

  let total;

  visit(dir, (n) => {
    if (n.isDir()) {
      const size = n.size();
      if (size >= 100_000) {
        let isLarge = true;
        for (let child of n.children.values()) {
          if (child.isDir() && child.size() >= 100_000) {
            isLarge = false;
          }
        }
        if (isLarge) {
          console.log("directory larger than threshold");
          console.dir({ path: n.pathname(), size });
          total += size;
        }
      }
    }
  });

  return total;
}

async function main() {
  let total = await part_one();
  console.log(`part 1 total: ${total}`);
}

main()
  .then((result) => console.log(`result: ${result}`))
  .catch((e) => console.error(e));
