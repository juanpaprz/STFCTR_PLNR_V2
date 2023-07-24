import { Component, Input, OnInit } from '@angular/core';
import { PlanTotal, TotalRow } from '../../Entities/plan-total.entity';

@Component({
  selector: 'app-comparative',
  templateUrl: './comparative.component.html',
  styleUrls: ['./comparative.component.css'],
})
export class ComparativeComponent implements OnInit {
  constructor() {}

  @Input() planTotal: PlanTotal = new PlanTotal();

  plansComparative: PlanComparative[] = [];

  ngOnInit() {}

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

    comparatives.forEach((c) => {
      this.addComparative(c);
    });
  }

  addComparative(comparative: PlanComparative) {
    let exists = this.plansComparative.find((p) => p.key === comparative.key);

    if (!exists) return this.plansComparative.push(comparative);

    return exists.values.push(...comparative.values);
  }
}

export class PlanComparative {
  planId: number = 0;
  key: string = '';
  values: number[] = [];

  constructor(value?: Partial<PlanComparative>) {
    Object.assign(this, value);
  }
}
