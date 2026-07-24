class ExecutionContextStack {
  constructor() {
    this.stack = [];
  }

  push(context) {
    this.stack.push(context);
  }

  pop() {
    return this.stack.pop();
  }

  current() {
    return this.stack[this.stack.length - 1];
  }

  size() {
    return this.stack.length;
  }

  getAll() {
    return this.stack;
  }
}


export default ExecutionContextStack;