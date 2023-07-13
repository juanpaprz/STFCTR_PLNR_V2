import { StackSize } from '../Common/stack-size.enum';

export class Item {
  id: string = '';
  name: string = '';
  stackSize: StackSize = 50;
  isResource: boolean = false;

  constructor(value?: Partial<Item>) {
    Object.assign(this, value);
  }
}
