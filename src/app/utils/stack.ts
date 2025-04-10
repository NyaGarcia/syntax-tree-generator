export class Stack<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  push(element: T) {
    this.items = [...this.items, element];
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
