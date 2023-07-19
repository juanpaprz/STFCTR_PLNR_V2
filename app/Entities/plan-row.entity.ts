import { Machine } from '../Entities/machine.entity';
import { Item } from '../Entities/item.entity';
import { Recipe } from '../Entities/recipe.entity';

export class PlanRow {
  id: number = 0;
  isGoal: boolean = false;
  step: number = 0;
  item: Item = new Item();
  itemId: string = '';
  recipes: Recipe[] = [];
  selectedRecipe: Recipe = new Recipe();
  selectedRecipeName: string = '';
  itemsPerMinute: number = 0;
  overflow: number = 0;
  machine: Machine = new Machine();
  machinesNumber: number = 0;
  powerConsumpsion: number = 0;
  fatherStep: PlanRow[] = [];

  constructor(value?: Partial<PlanRow>) {
    Object.assign(this, value);
  }
}
