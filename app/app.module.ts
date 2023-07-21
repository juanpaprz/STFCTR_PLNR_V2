import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ExportExcelComponent } from './Components/export-excel/export-excel.component';
import { PlannerTotalComponent } from './Components/planner-total/planner-total.component';
import { PlannerV2Component } from './Components/planner-v2/planner-v2.component';
import { SimulatorComponent } from './Components/simulator/simulator.component';
import { ItemService } from './Services/item.service';
import { MachineService } from './Services/machine.service';
import { RecipeService } from './Services/recipe.service';

const appRoutes: Routes = [
  { path: 'simulator', component: SimulatorComponent },
  { path: '', component: PlannerV2Component },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(appRoutes), FormsModule],
  providers: [ItemService, RecipeService, MachineService],
  declarations: [
    AppComponent,
    SimulatorComponent,
    PlannerV2Component,
    PlannerTotalComponent,
    ExportExcelComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
