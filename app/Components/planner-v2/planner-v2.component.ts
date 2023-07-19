import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../Services/item.service';
import { Item } from '../../Entities/item.entity';
import { PlanRow } from '../../Entities/plan-row.entity';
import { RecipeService } from '../../Services/recipe.service';

@Component({
  selector: 'app-planner-v2',
  templateUrl: './planner-v2.component.html',
  styleUrls: ['./planner-v2.component.css'],
})
export class PlannerV2Component implements OnInit {
  constructor(
    private itemService: ItemService,
    private recipeService: RecipeService
  ) {}

  plan: PlanRow[] = [];
  planGoal: PlanRow = new PlanRow();

  items: Item[] = [];

  ngOnInit() {
    this.plan.push(
      new PlanRow({
        id: 0,
        isGoal: true,
        step: 1,
      })
    );

    this.planGoal = this.plan.find((p) => p.isGoal)!;

    this.items = this.itemService.getAllItems();
    this.items = this.items.filter((i) =>
      this.recipeService.isItemCraftable(i.id)
    );
  }

  selectItemGoal() {
    this.planGoal.item = this.itemService.getItem(this.planGoal.itemId);
    this.setRecipes(this.planGoal)
  }

  setRecipes(planRow: PlanRow): PlanRow {
    planRow.recipes = this.recipeService.getRecipesOfItem(planRow.itemId);

    planRow.selectedRecipe = this.recipeService.getDefualtRecipe(planRow.itemId)

    return planRow;
  }
}
