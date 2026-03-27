import { Iterator } from './iterator.interface';

export class ArrayIterator<T> implements Iterator<T> {
  private currentIndex = 0;

  constructor(private readonly items: T[]) {}

  hasNext(): boolean {
    return this.currentIndex < this.items.length;
  }

  next(): T {
    if (!this.hasNext()) {
      throw new Error('No hay más elementos en la colección');
    }
    const current = this.items[this.currentIndex];
    this.currentIndex += 1;
    return current;
  }

  reset(): void {
    this.currentIndex = 0;
  }
}
