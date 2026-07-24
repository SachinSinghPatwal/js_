export const binaryOperators = {
  // Arithmetic
  "+": (left, right) => left + right,
  "-": (left, right) => left - right,
  "*": (left, right) => left * right,
  "/": (left, right) => left / right,
  "%": (left, right) => left % right,
  "**": (left, right) => left ** right,

  // Bitwise
  "&": (left, right) => left & right,
  "|": (left, right) => left | right,
  "^": (left, right) => left ^ right,
  "<<": (left, right) => left << right,
  ">>": (left, right) => left >> right,
  ">>>": (left, right) => left >>> right,

  // Equality
  "==": (left, right) => left == right,
  "===": (left, right) => left === right,
  "!=": (left, right) => left != right,
  "!==": (left, right) => left !== right,

  // Comparison
  "<": (left, right) => left < right,
  "<=": (left, right) => left <= right,
  ">": (left, right) => left > right,
  ">=": (left, right) => left >= right,
};
