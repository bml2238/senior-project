import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmissionModalComponent } from './submission-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FileUploadModule } from 'src/app/file-upload/file-upload.module';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SubmissionContentModule } from '../submission-content/submission-content.module';



@NgModule({
  declarations: [
    SubmissionModalComponent
  ],
  imports: [
    CommonModule,
    SubmissionContentModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FileUploadModule,
    MatDialogModule,
    FormsModule
  ],
  exports: [
    SubmissionModalComponent
  ]
})
export class SubmissionModalModule { }
