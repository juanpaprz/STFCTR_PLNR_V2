import { StackSize } from '../Common/stack-size.enum';

export class ItemJson {
  id: string = '';
  name: string = '';
  stackSize: keyof typeof StackSize = 'SS_BIG';
}
