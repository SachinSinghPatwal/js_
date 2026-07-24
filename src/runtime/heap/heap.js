export default class Heap {
  constructor() {
    this.memory = new Map();
    this.nextAddress = 1;
  }

  allocate(value) {
    const address = this.nextAddress++;

    this.memory.set(address, value);

    return address;
  }

  get(address) {
    return this.memory.get(address);
  }

  set(address, value) {
    this.memory.set(address, value);
  }
}
