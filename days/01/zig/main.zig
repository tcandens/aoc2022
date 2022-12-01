const std = @import("std");
const print = std.debug.print;

pub fn main() void {
  // const stdout = std.io.getStdOut().writer();
  const alloc = std.heap.page_allocator;
  const cwd: u8 = std.fs.cwd();
  var filepath: []u8 = std.fs.path.resolve(alloc, [cwd]);
}

