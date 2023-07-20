import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PlanTotal, TotalRow } from '../../Entities/plan-total.entity';
import { PlanRow } from '../../Entities/plan-row.entity';

@Component({
  selector: 'app-planner-total',
  templateUrl: './planner-total.component.html',
  styleUrls: ['./planner-total.component.css'],
})
export class PlannerTotalComponent implements OnInit, OnChanges {
  constructor() {}

  @Input() plan: PlanRow[] = [];

  planTotal: PlanTotal = new PlanTotal();

  ngOnInit() {}

  ngOnChanges() {
    this.planTotal = new PlanTotal();
    let planInputs = this.plan.filter((p) => p.item.isResource);
    let planOutpus = this.plan.filter((p) => p.isGoal || p.isByProduct);
    let planMachines = this.plan.filter(
      (p) => !p.isByProduct && !p.item.isResource
    );

    planInputs.forEach((i) => {
      let totalInput = new TotalRow({
        name: i.item.name,
        amount: i.itemsPerMinute,
      });
      this.planTotal.inputs.push(totalInput);
    });

    planOutpus.forEach((o) => {
      let totalOutput = new TotalRow({
        name: o.item.name,
        amount: o.itemsPerMinute,
      });
      this.planTotal.outputs.push(totalOutput);
    });

    planMachines.forEach((m) => {
      let totalMachines = new TotalRow({
        name: m.machine.name,
        amount: m.machinesNumber,
        totalPower: m.powerConsumption,
      });
      this.pushTotalMachine(totalMachines);
    });

    this.planTotal.totalPowerConsumption = this.planTotal.machines.reduce(
      (acc, m) => {
        return acc + m.totalPower;
      },
      0
    );
  }

  pushTotalMachine(totalMachine: TotalRow) {
    let exists = this.planTotal.machines.find(
      (m) => m.name == totalMachine.name
    );

    if (!exists) return this.planTotal.machines.push(totalMachine);

    exists.amount += totalMachine.amount;
    exists.totalPower += totalMachine.totalPower;
  }
}
