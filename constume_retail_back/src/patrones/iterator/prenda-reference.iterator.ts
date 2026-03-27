import { ArrayIterator } from './array.iterator';

export class PrendaReferenceIterator extends ArrayIterator<string> {
  constructor(referencias: string[]) {
    super(referencias);
  }
}
