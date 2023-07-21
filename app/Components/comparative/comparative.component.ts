import { Component, Input, OnInit } from '@angular/core';
import { PlanTotal } from '../../Entities/plan-total.entity';

@Component({
  selector: 'app-comparative',
  templateUrl: './comparative.component.html',
  styleUrls: ['./comparative.component.css'],
})
export class ComparativeComponent implements OnInit {
  constructor() {}

  planComparative: PlanComaprative[] = []

  @Input() planTotal: PlanTotal = new PlanTotal();

  ngOnInit() {
    this.addComparative();
  }

  addComparative() {
    let inputComp = this.planTotal.inputs.map(i => {
      let comp: PlanComaprative = {
        [i.name]: i.amount
      }
      return comp
    })
    
  }
}

export type PlanComaprative = {
  [key: string]: number;
};
