import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MilestonesComponent } from './milestones.component';
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCheckboxModule} from "@angular/material/checkbox";



@NgModule({
  declarations: [
    MilestonesComponent,
  ],
  exports: [
    MilestonesComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    RouterLink,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatCheckboxModule,
  ]
})
export class MilestonesModule { }
