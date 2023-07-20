import { Machine } from '../Entities/machine.entity';
import { Item } from '../Entities/item.entity';
import { ItemRecipe, Recipe } from '../Entities/recipe.entity';

export class PlanRow {
  id: number = 0;
  isGoal: boolean = false;
  step: number = 0;
  item: Item = new Item();
  itemId: string = '';
  recipes: Recipe[] = [];
  selectedRecipe: Recipe = new Recipe();
  selectedRecipeId: string = '';
  itemsPerMinute: number = 0;
  itemCraftPerMinute: number = 0;
  byProducts: ItemRecipe[] = [];
  isByProduct: boolean = false;
  overflow: number = 0;
  machine: Machine = new Machine();
  machinesNumber: number = 0;
  powerConsumption: number = 0;
  fatherSteps: PlanRow[] = [];

  constructor(value?: Partial<PlanRow>) {
    Object.assign(this, value);
  }
}
