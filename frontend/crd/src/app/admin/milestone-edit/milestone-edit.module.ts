import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MilestoneEditComponent } from './milestone-edit.component';
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TaskEditModalModule } from '../task-edit-modal/task-edit-modal.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MilestoneEditComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    TaskEditModalModule,
    HttpClientModule
  ]
})
export class MilestoneEditModule { }
