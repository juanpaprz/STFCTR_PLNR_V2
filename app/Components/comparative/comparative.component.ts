import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../Entities/item.entity';
import { ItemService } from '../../Services/item.service';
import { PlanTotal, TotalRow } from '../../Entities/plan-total.entity';
import { PlanRow } from '../../Entities/plan-row.entity';

@Component({
  selector: 'app-comparative',
  templateUrl: './comparative.component.html',
  styleUrls: ['./comparative.component.css'],
})
export class ComparativeComponent implements OnInit {
  constructor(private itemService: ItemService) {}

  @Output() selectPlanEvent: EventEmitter<PlanRow[]> = new EventEmitter();

  @Input() planTotal: PlanTotal = new PlanTotal();
  @Input() planToCompare: PlanRow[] = [];

  plansComparative: PlanComparative[] = [];

  resources: Item[] = [];

  ngOnInit() {
    this.resources = this.itemService.getResources();
    this.resources.push(
      new Item({
        id: 'power',
        name: 'Power',
        isResource: true,
      })
    );

    this.resources.forEach((r) => {
      this.plansComparative.push(
        new PlanComparative({
          key: r.name,
          values: [],
        })
      );
    });
  }

  createCompartive() {
    let totalRows = [
      ...this.planTotal.inputs,
      ...this.planTotal.outputs,
      new TotalRow({
        name: 'Power',
        amount: this.planTotal.totalPowerConsumption,
      }),
    ];

    let comparatives = totalRows.map((t) => {
      return new PlanComparative({
        key: t.name,
        values: [t.amount],
      });
    });

    if (!comparatives.some((c) => c.values.some((v) => v > 0))) return;

    this.plansComparative.forEach((c) => {
      c.plans.push(this.planToCompare);
      let comparative = comparatives.find((p) => p.key === c.key);

      if (!comparative) return c.values.push(0);

      c.values.push(comparative.values[0]);
    });
  }

  hasValue(planComparative: PlanComparative): boolean {
    return planComparative.values.some((v) => v > 0);
  }

  setBetterOptionClass(planComparative: PlanComparative, value: number): {} {
    let isBetterOption = !planComparative.values.some((v) => v < value);
    return { 'text-success': isBetterOption };
  }

  onPlanSelected(index: number) {
    let plan: PlanRow[] = this.plansComparative[0].plans[index];
    console.log(plan);
    this.selectPlanEvent.emit(plan);
  }
}

export class PlanComparative {
  key: string = '';
  values: number[] = [];
  plans: PlanRow[][] = [];

  constructor(value?: Partial<PlanComparative>) {
    Object.assign(this, value);
  }
}
