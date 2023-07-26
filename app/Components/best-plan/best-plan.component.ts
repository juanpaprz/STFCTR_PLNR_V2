import { Component, Input, OnInit } from '@angular/core';
import { PlanRow } from '../../Entities/plan-row.entity';

@Component({
  selector: 'app-best-plan',
  templateUrl: './best-plan.component.html',
  styleUrls: ['./best-plan.component.css'],
})
export class BestPlanComponent implements OnInit {
  constructor() {}

  @Input() planGoals: PlanRow[] = [];

  ngOnInit() {}
}
