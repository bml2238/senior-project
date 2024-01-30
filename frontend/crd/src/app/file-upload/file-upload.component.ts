import {Component, Inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.less']
})
export class FileUploadComponent {
  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file: File | null = null; // Variable to store file

  url: string = ""

  private maxSizeMegaBytes = 10;
  private maxSizeBytes = this.maxSizeMegaBytes * 1024 * 1024; // 10 MB


  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { url:string },
    private dialogRef: MatDialogRef<FileUploadComponent>,
  ) {
    this.url = data.url;
  }

  // On file Select
  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {

      if (file.size > this.maxSizeBytes) {
        alert(`File size exceeds the maximum allowed size (${this.maxSizeMegaBytes} MB).`)
        // Display an error message or perform other actions
        console.error(`File size exceeds the maximum allowed size (${this.maxSizeMegaBytes} MB).`);
      } else {
        // File is within the allowed size, proceed with handling
        this.status = "initial";
        this.file = file;
      }
    }
  }

  onUpload() {
    if (this.file) {
      const formData = new FormData();

      formData.append('file', this.file, this.file.name);

      const upload$ = this.http.post(this.url, formData, { responseType: 'text' });

      this.status = 'uploading';

      upload$.subscribe({
        next: () => {
          this.status = 'success';
          setTimeout(() => {this.dialogRef.close()}, 1000)
        },
        error: (error: any) => {
          this.status = 'fail';
          return console.log(error);
        },
      });
    }
  }

  onClose(): void {
    // Close the dialog when the close button is clicked
    this.dialogRef.close();
  }
}
