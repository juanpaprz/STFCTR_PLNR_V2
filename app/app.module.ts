import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PlannerComponent } from './Components/planner/planner.component';
import { SimulatorComponent } from './Components/simulator/simulator.component';
import { ItemService } from './Services/item.service';
import { MachineService } from './Services/machine.service';
import { RecipeService } from './Services/recipe.service';

const appRoutes: Routes = [
  { path: 'simulator', component: SimulatorComponent },
  { path: '', component: PlannerComponent },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(appRoutes), FormsModule],
  providers: [ItemService, RecipeService, MachineService],
  declarations: [AppComponent, SimulatorComponent, PlannerComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
