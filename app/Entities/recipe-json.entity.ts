export class RecipeJson {
  name: string = '';
  isAlternate: boolean = false;
  producedIn: string = '';
  timeCrafting: number = 0;
  ingridients: ItemRecipeJson[] = [];
  products: ItemRecipeJson[] = [];
}

export class ItemRecipeJson {
  item: string = '';
  amount: number = 0;
}
