import { Component, Input, OnInit } from '@angular/core';
import { PlanTotal } from '../../Entities/plan-total.entity';

@Component({
  selector: 'app-comparative',
  templateUrl: './comparative.component.html',
  styleUrls: ['./comparative.component.css'],
})
export class ComparativeComponent implements OnInit {
  constructor() {}

  @Input() planTotal: PlanTotal = new PlanTotal();

  comparative: object[] = [];

  ngOnInit() {}

  addComparative() {
    let comparativeInputs = this.planTotal.inputs.reduce((acc, i) => {
      return acc.set(i.name, i.amount);
    }, new Map());

    let comparativeOutputs = this.planTotal.outputs.reduce((acc, o) => {
      return acc.set(o.name, o.amount);
    }, new Map());

    let comparativePower = new Map([
      ['Power', this.planTotal.totalPowerConsumption],
    ]);

    let mergedMaps = new Map([
      ...comparativeInputs,
      ...comparativeOutputs,
      ...comparativePower,
    ]);

    let comparative = Object.fromEntries(mergedMaps);
  }
}
