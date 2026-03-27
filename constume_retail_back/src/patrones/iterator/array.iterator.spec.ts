import { ArrayIterator } from './array.iterator';

describe('ArrayIterator', () => {
  it('recorre todos los elementos en orden', () => {
    const iterator = new ArrayIterator([10, 20, 30]);

    expect(iterator.hasNext()).toBe(true);
    expect(iterator.next()).toBe(10);
    expect(iterator.next()).toBe(20);
    expect(iterator.next()).toBe(30);
    expect(iterator.hasNext()).toBe(false);
  });

  it('reinicia el recorrido con reset()', () => {
    const iterator = new ArrayIterator(['a', 'b']);

    expect(iterator.next()).toBe('a');
    iterator.reset();
    expect(iterator.next()).toBe('a');
  });

  it('lanza error si se intenta leer fuera de rango', () => {
    const iterator = new ArrayIterator([1]);

    iterator.next();
    expect(() => iterator.next()).toThrow(
      'No hay más elementos en la colección',
    );
  });
});
