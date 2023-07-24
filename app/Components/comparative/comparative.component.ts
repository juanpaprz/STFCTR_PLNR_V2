import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../Entities/item.entity';
import { ItemService } from '../../Services/item.service';
import { PlanTotal, TotalRow } from '../../Entities/plan-total.entity';

@Component({
  selector: 'app-comparative',
  templateUrl: './comparative.component.html',
  styleUrls: ['./comparative.component.css'],
})
export class ComparativeComponent implements OnInit {
  constructor(private itemService: ItemService) {}

  @Input() planTotal: PlanTotal = new PlanTotal();

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

    this.plansComparative.forEach((c) => {
      let comparative = comparatives.find((p) => p.key === c.key);

      if (!comparative) return c.values.push(0);

      c.values.push(comparative.values[0]);
    });
  }

  hasValue(planComparative: PlanComparative): boolean {
    return planComparative.values.some(v => v > 0)
  }

  setBetterOptionClass(planComparative: PlanComparative, values: number): {} {
    let isBetterOption = !planComparative.values.some(v => v <= values)
    return {"text-success": isBetterOption}
  }
}

export class PlanComparative {
  key: string = '';
  values: number[] = [];

  constructor(value?: Partial<PlanComparative>) {
    Object.assign(this, value);
  }
}
