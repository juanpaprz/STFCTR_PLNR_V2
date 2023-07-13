import { Machine } from '../Entities/machine.entity';
import { Item } from '../Entities/item.entity';
import { Recipe } from '../Entities/recipe.entity';

export class PlanRow {
  id: number = 0;
  step: number = 0;
  item: Item = new Item();
  recipes: Recipe[] = [];
  selectedRecipe: Recipe = new Recipe();
  selectedRecipeName: string = '';
  itemsPerMinute: number = 0;
  overflow: number = 0;
  machine: Machine = new Machine();
  machinesNumber: number = 0;
  powerConsumpsion: number = 0;
  fatherStep: PlanRow | undefined = undefined;

  constructor(value?: Partial<PlanRow>) {
    Object.assign(this, value);
  }
}
