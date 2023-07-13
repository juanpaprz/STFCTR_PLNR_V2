import { Item } from '../Entities/item.entity';

export class Recipe {
  name: string = '';
  isAlternate: boolean = false;
  producedIn: string = '';
  timeCrafting: number = 0;
  craftsPerMinute: number = 0;
  ingridients: ItemRecipe[] = [];
  products: ItemRecipe[] = [];

  constructor(value?: Partial<Recipe>) {
    Object.assign(this, value);
  }
}

export class ItemRecipe {
  item: Item = new Item();
  amount: number = 0;
  amountPerMinute: number = 0;
}
