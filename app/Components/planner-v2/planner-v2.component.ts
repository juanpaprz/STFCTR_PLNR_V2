import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../../Services/item.service';
import { Item } from '../../Entities/item.entity';
import { PlanRow } from '../../Entities/plan-row.entity';
import { RecipeService } from '../../Services/recipe.service';
import { MachineService } from '../../Services/machine.service';

@Component({
  selector: 'app-planner-v2',
  templateUrl: './planner-v2.component.html',
  styleUrls: ['./planner-v2.component.css'],
})
export class PlannerV2Component implements OnInit {
  constructor(
    private itemService: ItemService,
    private recipeService: RecipeService,
    private machineService: MachineService
  ) {}

  plan: PlanRow[] = [];
  planGoals: PlanRow[] = [];
  items: Item[] = [];

  ngOnInit() {
    this.plan.push(
      new PlanRow({
        id: 0,
        isGoal: true,
        step: 1,
      })
    );

    this.planGoals = this.plan.filter((p) => p.isGoal);

    this.items = this.itemService.getAllItems();
    this.items = this.items.filter((i) =>
      this.recipeService.isItemCraftable(i.id)
    );
  }

  addItemGoal() {
    let newPlanGoal = new PlanRow({
      id: this.getNewId(),
      isGoal: true,
      step: 1,
    });
    this.plan.push(newPlanGoal);
    this.planGoals = this.plan.filter((p) => p.isGoal);

    this.plan.sort((a, b) => a.step - b.step);
  }

  deletePlanGoal(planId: number) {
    let planRow = this.plan.find((p) => p.id === planId);

    if (!planRow) throw new Error('Plan goal not found');
    if (!planRow.isGoal) throw new Error('Row is not goal');
    if (this.planGoals.length <= 1) throw new Error('Can´t delete all goals');

    this.plan = this.plan.filter((p) => p.id !== planId);
    this.planGoals = this.plan.filter((p) => p.isGoal);
    this.deleteChildrenStep(planRow);
  }

  isPlanCreated(): boolean {
    return this.planGoals.some((p) => p.machine.name);
  }

  selectItemGoal(planId: number) {
    let planRow = this.plan.find((p) => p.id === planId);

    if (!planRow) throw new Error('Plan goal not found');
    if (!planRow.isGoal) throw new Error('Row is not Goal');

    if (!planRow.itemId) return this.deleteChildrenStep(planRow);
    planRow.item = this.itemService.getItem(planRow.itemId);
    this.setDefaultRecipe(planRow);

    this.createPlan(planRow);
  }

  createPlan(planRow: PlanRow) {
    this.deleteChildrenStep(planRow);
    this.generatePlanByProducts(planRow);
    this.forEachIngridient(planRow);
    this.forEachPlanGoal();
  }

  setDefaultRecipe(planRow: PlanRow) {
    planRow.recipes = this.recipeService.getRecipesOfItem(planRow.itemId);
    let selectedRecipe = (planRow.selectedRecipe =
      this.recipeService.getDefualtRecipe(planRow.itemId));
    planRow.selectedRecipeId = selectedRecipe.id;
    this.setRecipeExtraData(planRow);
  }

  changeRecipe(planId: number) {
    let planRow = this.plan.find((p) => p.id === planId);

    if (!planRow) throw new Error('Plan step not found');

    planRow.selectedRecipe = this.recipeService.getReicpe(
      planRow.selectedRecipeId
    );
    this.setRecipeExtraData(planRow);

    this.createPlan(planRow);
  }

  setRecipeExtraData(planRow: PlanRow) {
    planRow.machine = this.machineService.getMachine(
      planRow.selectedRecipe.producedIn
    );
    planRow.itemCraftPerMinute = this.recipeService.getItemCraftPerMinute(
      planRow.selectedRecipe,
      planRow.itemId
    );
    planRow.byProducts = this.recipeService.getRecipeByProducts(
      planRow.selectedRecipe,
      planRow.itemId
    );
  }

  forEachIngridient(planRow: PlanRow) {
    planRow.selectedRecipe.ingridients.forEach((i) => {
      this.generatePlanChild(i.item, planRow);
    });
  }

  deleteChildrenStep(planRow: PlanRow) {
    this.plan = this.plan.filter((p) => p.fatherSteps.length || p.isGoal);
    this.plan.forEach((p) => {
      p.fatherSteps = p.fatherSteps.filter((f) => f !== planRow);
    });

    let deletedChildren = this.plan.filter(
      (p) => !(p.fatherSteps.length || p.isGoal)
    );

    if (!deletedChildren.length) return;

    deletedChildren.forEach((c) => {
      this.deleteChildrenStep(c);
    });
  }

  getNewId(): number {
    let ids = this.plan.map((p) => p.id);
    return Math.max(...ids) + 1;
  }

  generatePlanByProducts(planRow: PlanRow) {
    planRow.byProducts.forEach((b) => {
      let planByProduct = new PlanRow({
        id: this.getNewId(),
        step: planRow.step,
        item: b.item,
        itemId: b.item.id,
        isByProduct: true,
        fatherSteps: [planRow],
      });
      this.addNewStep(planByProduct);
    });
  }

  generatePlanChild(item: Item, planFather: PlanRow) {
    let planChild = new PlanRow({
      id: this.getNewId(),
      step: planFather.step + 1,
      item: item,
      itemId: item.id,
      fatherSteps: [planFather],
    });

    if (item.isResource) return this.addNewStep(planChild);

    this.setDefaultRecipe(planChild);
    let wasAdded = this.addNewStep(planChild);

    if (!wasAdded) return;

    this.generatePlanByProducts(planChild);

    this.forEachIngridient(planChild);
  }

  addNewStep(planRow: PlanRow): boolean {
    let exists = this.plan.find(
      (p) =>
        p.itemId === planRow.itemId &&
        p.isByProduct === planRow.isByProduct &&
        !p.isGoal
    );

    if (!exists) {
      this.plan.push(planRow);
      return true;
    }

    let fatherExists = exists.fatherSteps.find(
      (f) =>
        f.itemId === planRow.fatherSteps[0].itemId &&
        f.isGoal === planRow.fatherSteps[0].isGoal
    );

    if (fatherExists) return false;

    exists.fatherSteps.push(planRow.fatherSteps[0]);
    exists.step = exists.step >= planRow.step ? exists.step : planRow.step;
    return false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;

    this.forEachPlanGoal();
  }

  forEachPlanGoal() {
    let planGoals = this.plan.filter((p) => p.isGoal);
    planGoals.forEach((p) => {
      this.calculatePlanStepValues(p);
    });
    this.calculatePlanByProductsValue();
    this.plan.sort((a, b) => a.step - b.step);
    this.plan = this.plan.slice();
  }

  calculatePlanStepValues(planRow: PlanRow) {
    let itemsPerMinute = planRow.isGoal
      ? planRow.itemsPerMinute
      : this.getItemsPerMinute(planRow);

    planRow.itemsPerMinute = itemsPerMinute;
    let machinesNumber = Math.ceil(itemsPerMinute / planRow.itemCraftPerMinute);
    planRow.machinesNumber = machinesNumber;
    planRow.overflow =
      machinesNumber * planRow.itemCraftPerMinute - itemsPerMinute;

    planRow.powerConsumption =
      machinesNumber * planRow.machine.powerConsumption;

    let rowChildren = this.plan.filter((p) =>
      p.fatherSteps.some((f) => f === planRow && !p.isByProduct)
    );
    rowChildren.forEach((c) => {
      this.calculatePlanStepValues(c);
    });
    return;
  }

  getItemsPerMinute(planRow: PlanRow): number {
    let planFathers = planRow.fatherSteps.filter((f) => f.machinesNumber > 0);
    let itemsPerMinute = planFathers.reduce((count, f) => {
      let craftPerMinute = this.recipeService.getIngridientItemCraftPerMinute(
        f.selectedRecipe,
        planRow.itemId
      );
      return count + f.machinesNumber * craftPerMinute;
    }, 0);
    return itemsPerMinute;
  }

  calculatePlanByProductsValue() {
    let byProducts = this.plan.filter((p) => p.isByProduct);
    byProducts.forEach((p) => {
      let craftPerMinute = p.fatherSteps.reduce((cont, f) => {
        let fatherPerMinute = this.recipeService.getItemCraftPerMinute(
          f.selectedRecipe,
          p.itemId
        );
        return cont + fatherPerMinute * f.machinesNumber;
      }, 0);

      p.itemsPerMinute = craftPerMinute;
    });
  }

  activeteRow(planRow: PlanRow) {
    this.plan.forEach((p) => (p.rowClasses = { 'table-dark': false }));
    planRow.rowClasses = { 'table-dark': true };
    planRow.fatherSteps.forEach((f) => (f.rowClasses = { 'table-dark': true }));
  }

  setPlanSelected(selectedPlan: PlanRow[]) {
    this.plan = selectedPlan;
  }
}
