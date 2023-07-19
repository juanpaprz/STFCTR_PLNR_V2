import { Component, OnInit } from '@angular/core';
import { PlanRow } from '../../Entities/plan-row.entity';

@Component({
  selector: 'app-planner-v2',
  templateUrl: './planner-v2.component.html',
  styleUrls: ['./planner-v2.component.css'],
})
export class PlannerV2Component implements OnInit {
  constructor() {}

  plan: PlanRow[] = [];

  ngOnInit() {}
}
