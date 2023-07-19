import { Component, HostListener, OnInit } from '@angular/core';
import { RecipeService } from '../../Services/recipe.service';
import { Item } from '../../Entities/item.entity';
import { ItemService } from '../../Services/item.service';
import { PlanRow } from '../../Entities/plan-row.entity';
import { MachineService } from '../../Services/machine.service';
import { Machine } from '../../Entities/machine.entity';
import { PlanTotal, TotalRow } from '../../Entities/plan-total.entity';
import { Recipe } from '../../Entities/recipe.entity';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
})
export class PlannerComponent implements OnInit {
  constructor(
    private itemService: ItemService,
    private recipeService: RecipeService,
    private machineService: MachineService
  ) {}

  items: Item[] = [];

  planGoal: PlanRow = new PlanRow();
  itemGoal: string = '';
  ipmGoalFocus: boolean = false;

  planTotal: PlanTotal = new PlanTotal();

  planSteps: PlanRow[] = [];
  reducedSteps: PlanRow[] = [];
  stepRecipes: StepRecipe[] = [];

  ngOnInit() {
    this.items = this.itemService.getAllItems();
    this.items = this.items.filter((i) =>
      this.recipeService.isItemCraftable(i.id)
    );

    this.planGoal.step = 1;
    this.planGoal.id = 1;

    console.log(this.items);
  }

  selectItemGoal() {
    let selectedItemPlan = this.items.find((i) => i.id === this.itemGoal);
    if (!selectedItemPlan) return;
    this.planGoal.item = selectedItemPlan;
    this.planGoal.recipes = this.recipeService.getRecipesOfItem(this.itemGoal);
    let defaultRecipe = this.planGoal.recipes.find((r) => !r.isAlternate);

    if (!defaultRecipe) defaultRecipe = this.planGoal.recipes[0];

    console.log(defaultRecipe);

    this.planGoal.selectedRecipe = defaultRecipe;
    this.planGoal.selectedRecipeName = defaultRecipe.name;

    let machine = this.getRecipeMachine(
      this.planGoal.selectedRecipe.producedIn
    );

    if (!machine) return;
    this.planGoal.machine = machine;

    this.changePlan(this.planGoal, this.planGoal.id);
  }

  selectRecipe(index: number = -1) {
    if (index === -1) {
      this.planGoal = this.changeRecipe(this.planGoal);
      this.changePlan(this.planGoal, this.planGoal.id);
    } else {
      let step = this.planSteps.find((s) => s.id === index);
      if (!step) return;
      step = this.changeRecipe(step);
      this.changePlan(step, step.id);
    }
  }

  changeRecipe(step: PlanRow): PlanRow {
    let newSelectedRecipeName = step.selectedRecipeName;
    let newRecipe = step.recipes.find((r) => r.name === newSelectedRecipeName);

    if (!newRecipe) return step;

    step.selectedRecipe = newRecipe;

    let stepRecipe: StepRecipe = {
      name: step.item.id,
      recipe: step.selectedRecipe,
    };

    this.saveStepRecipe(stepRecipe);

    let machine = this.getRecipeMachine(step.selectedRecipe.producedIn);

    if (!machine) return step;

    step.machine = machine;
    return step;
  }

  saveStepRecipe(stepRecipe: StepRecipe) {
    this.stepRecipes = this.stepRecipes.filter(
      (r) => r.name !== stepRecipe.name
    );

    this.stepRecipes.push(stepRecipe);
  }

  getRecipeMachine(machineName: string): Machine | undefined {
    let machine = this.machineService.getMachine(machineName);

    if (!machine) return;

    return machine;
  }

  changeIPMGoalFocus() {
    this.ipmGoalFocus = !this.ipmGoalFocus;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;

    if (!this.ipmGoalFocus) return;

    this.changePlan(this.planGoal, this.planGoal.id);
  }

  changeAmountPerMinuteGoal(step: PlanRow): PlanRow {
    let stepItem = step.selectedRecipe.products.find(
      (p) => p.item.id === step.item.id
    );
    if (!stepItem) return step;

    let stepItemCraftPerMinute = stepItem.amountPerMinute;
    let numberofMachines = Math.ceil(
      step.itemsPerMinute / stepItemCraftPerMinute
    );

    step.machinesNumber = numberofMachines;
    step.powerConsumpsion = numberofMachines * step.machine.powerConsumpsion;

    step.overflow =
      numberofMachines * stepItemCraftPerMinute - step.itemsPerMinute;

    return step;
  }

  changePlan(step: PlanRow, id: number) {
    step = this.changeAmountPerMinuteGoal(step);

    this.deleteChildren(id);
    step.selectedRecipe.ingridients.forEach((i) => {
      this.createPlanSteps(i.item, step);
    });
    this.getTotals();
  }

  deleteChildren(id: number) {
    /*let childrens = this.planSteps.filter((s) => s.fatherStep!.id === id);
    this.planSteps = this.planSteps.filter((s) => s.fatherStep!.id !== id);

    if (!childrens.length) return;

    childrens.forEach((c) => {
      this.deleteChildren(c.id);
    });*/
  }

  createPlanSteps(item: Item, fatherStep: PlanRow) {
    let nextStep: PlanRow = new PlanRow({
      item: item,
    });

    nextStep.id = this.createStepId();
    //nextStep.fatherStep = fatherStep;

    let itemCraft = fatherStep.selectedRecipe.ingridients.find(
      (i) => i.item.id === item.id
    );
    if (!itemCraft) return;

    nextStep.itemsPerMinute =
      fatherStep.machinesNumber * itemCraft.amountPerMinute;

    nextStep.step = fatherStep.step + 1;

    if (item.isResource) {
      this.planSteps.push(nextStep);
      return;
    }

    let itemRecipes = this.recipeService.getRecipesOfItem(item.id);
    nextStep.recipes = itemRecipes;

    let defaultRecipe = nextStep.recipes.find((r) => !r.isAlternate);

    if (!defaultRecipe) defaultRecipe = nextStep.recipes[0];

    nextStep.selectedRecipe = defaultRecipe;
    nextStep.selectedRecipeName = defaultRecipe.name;

    let stepItemCraft = nextStep.selectedRecipe.products.find(
      (p) => p.item.name === nextStep.selectedRecipeName
    );

    if (!stepItemCraft) return;

    let machine = this.getRecipeMachine(nextStep.selectedRecipe.producedIn);

    if (!machine) return;

    nextStep.machine = machine;

    nextStep.machinesNumber = Math.ceil(
      nextStep.itemsPerMinute / stepItemCraft.amountPerMinute
    );

    nextStep.powerConsumpsion =
      nextStep.machinesNumber * nextStep.machine.powerConsumpsion;

    nextStep.overflow =
      nextStep.machinesNumber * stepItemCraft.amountPerMinute -
      nextStep.itemsPerMinute;

    this.planSteps.push(nextStep);

    this.planSteps.sort((a, b) => a.id - b.id);

    nextStep.selectedRecipe.ingridients.forEach((i) => {
      this.createPlanSteps(i.item, nextStep);
    });
  }

  createStepId(): number {
    let id = 0;

    if (!this.planSteps.length) return 2;

    let lastId = this.planSteps[this.planSteps.length - 1].id;

    id = lastId + 1;

    return id;
  }

  setAlternateRecipes() {
    this.planSteps.forEach((s) => {
      if (!this.stepRecipes.some((r) => r.name === s.item.id)) return;

      s.selectedRecipe = this.stepRecipes.find(
        (r) => r.name === s.item.id
      )!.recipe;
      s.selectedRecipeName = s.selectedRecipe.name;
    });
  }

  reduceSteps() {
    this.reducedSteps = this.planSteps;
  }

  getTotals() {
    let totalInputs: TotalRow[] = [];
    let totalOutputs: TotalRow[] = [];
    let totalMachines: TotalRow[] = [];

    let totalRow: TotalRow = new TotalRow({
      name: this.planGoal.item.name,
      amount: this.planGoal.itemsPerMinute,
    });

    totalOutputs.push(totalRow);

    totalRow = new TotalRow({
      name: this.planGoal.machine.name,
      amount: this.planGoal.machinesNumber,
      totalPower: this.planGoal.powerConsumpsion,
    });

    totalMachines.push(totalRow);

    this.planSteps.forEach((s) => {
      if (!s.item.isResource) {
        totalRow = new TotalRow({
          name: s.machine.name,
          amount: s.machinesNumber,
          totalPower: s.powerConsumpsion,
        });

        totalMachines.push(totalRow);
      } else {
        totalRow = new TotalRow({
          name: s.item.name,
          amount: s.itemsPerMinute,
        });

        totalInputs.push(totalRow);
      }
    });

    totalInputs = this.reduceSameTotals(totalInputs);
    totalOutputs = this.reduceSameTotals(totalOutputs);
    totalMachines = this.reduceSameTotals(totalMachines);

    let totalPorweComsumption = totalMachines.reduce(
      (c, m) => c + m.totalPower,
      0
    );

    this.planTotal.inputs = totalInputs;
    this.planTotal.outputs = totalOutputs;
    this.planTotal.machines = totalMachines;
    this.planTotal.totalPowerConsumption = totalPorweComsumption;
  }

  reduceSameTotals(totalRows: TotalRow[]): TotalRow[] {
    let reducedRows: TotalRow[] = [];
    totalRows.forEach((t) => {
      if (reducedRows.some((rr) => rr.name === t.name)) return;
      let sameRows = totalRows.filter((r) => r.name === t.name);
      let reducedAmount = sameRows.reduce((c, r) => c + r.amount, 0);
      let reducedTotalPower = sameRows.reduce((c, r) => c + r.totalPower, 0);

      let newTotalRow: TotalRow = {
        name: t.name,
        amount: reducedAmount,
        totalPower: reducedTotalPower,
      };

      reducedRows.push(newTotalRow);
    });

    return reducedRows;
  }
}

export class StepRecipe {
  name: string = '';
  recipe: Recipe = new Recipe();
}
