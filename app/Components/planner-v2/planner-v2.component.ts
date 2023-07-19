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
    if (!this.planGoal.itemId) return;
    this.planGoal.item = this.itemService.getItem(this.planGoal.itemId);
    this.setRecipes(this.planGoal);
    this.forEachIngridient(this.planGoal);

    console.log(this.plan);
  }

  setRecipes(planRow: PlanRow) {
    planRow.recipes = this.recipeService.getRecipesOfItem(planRow.itemId);
    planRow.selectedRecipe = this.recipeService.getDefualtRecipe(
      planRow.itemId
    );
    planRow.selectedRecipeId = planRow.selectedRecipe.id;
  }

  changeRecipe(planId: number) {
    let planRow = this.plan.find((p) => p.id === planId);

    if (!planRow) throw new Error('Plan step not found');

    planRow.selectedRecipe = this.recipeService.getReicpe(
      planRow.selectedRecipeId
    );
  }

  forEachIngridient(planRow: PlanRow) {
    this.deleteChildrenStep(planRow);
    planRow.selectedRecipe.ingridients.forEach((i) => {
      this.generatePlanChild(i.item, planRow);
    });
  }

  deleteChildrenStep(planRow: PlanRow) {
    this.plan.forEach(p => {
      
    })

    console.log(this.plan);

    //this.plan = this.plan.filter((p) => p.fatherSteps.length || p.isGoal);
  }

  getNewId(): number {
    let ids = this.plan.map((p) => p.id);
    return Math.max(...ids) + 1;
  }

  generatePlanChild(item: Item, planFather: PlanRow) {
    let planChild = new PlanRow({
      id: this.getNewId(),
      step: planFather.step + 1,
      isGoal: false,
      item: item,
      itemId: item.id,
      fatherSteps: [planFather],
    });

    if (item.isResource) return this.addNewStep(planChild);

    this.setRecipes(planChild);
    this.addNewStep(planChild);

    this.forEachIngridient(planChild);
  }

  addNewStep(planRow: PlanRow) {
    let exists = this.plan.find((p) => p.itemId === planRow.itemId);

    if (!exists) return this.plan.push(planRow);

    exists.fatherSteps.push(planRow.fatherSteps[0]);
  }
}
