import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import {PortfolioComponent} from "./portfolio.component";
import {MilestonesModule} from "../milestones-page/milestones/milestones.module";
import {MatButtonModule} from "@angular/material/button";
import { ResumeModule } from './resume/resume.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    PortfolioComponent,
  ],
  exports: [
  ],
    imports: [
      CommonModule,
      MatCardModule,
      MilestonesModule,
      MatButtonModule,
      ResumeModule,
      MatIconModule
    ]
})
export class PortfolioModule { }
