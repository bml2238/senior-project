import { HttpClient } from '@angular/common/http';
import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event } from "../../../domain/Event";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";


@Component({
  selector: 'app-event-edit-modal',
  templateUrl: './event-edit-modal.component.html',
  styleUrls: ['./event-edit-modal.component.less']
})
@Injectable()
export class EventEditModalComponent implements OnInit {

  eventForm!: FormGroup;
  public currentEvent: Event | undefined;
  public eventName: string = '';


  constructor(
    public dialogRef: MatDialogRef<EventEditModalComponent>,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) {

    if (this.modalData.event) {
      this.currentEvent = this.modalData.event;
      this.eventName = this.modalData.event.name;
    }
  }

  ngOnInit() {
    this.createForm();
  }

  /**
   * Creates the FormGroup either using the provided event data or blank
   */
  createForm() {
    if (this.currentEvent) {
      this.eventForm = this.formBuilder.group({
        name: [this.eventName],
        date: [this.currentEvent.date],
        description: [this.currentEvent.description],
        location: [this.currentEvent.location],
        organizer: [this.currentEvent.organizer],
        link: [this.currentEvent.eventLink],
        buttonLabel: [this.currentEvent.buttonLabel],
        recurring: [this.currentEvent.isRecurring],
      });
    }

    else {
      this.eventForm = this.formBuilder.group({
        name: [null, Validators.required],
        date: [null, Validators.required],
        description: [null],
        location: [null, Validators.required],
        organizer: [null, Validators.required],
        link: [null],
        buttonLabel: ['More Info'],
        recurring: [false],
      });
    }
  }


  closeModal() {
    this.dialogRef.close();
  }

  /**
   * Takes event data from the form and sends the POST request
   * Either update event or create event, depending on whether there is a currentEvent
   */
  saveEvent() {
    if (this.currentEvent) {
      const updateData: any = {};

      updateData.id = this.currentEvent.eventID as unknown as number;

      // these are required arguments, also assumed to already exist on the event
      updateData.name = this.eventForm.get('name')!.value;
      updateData.date = this.eventForm.get('date')!.value;
      updateData.location = this.eventForm.get('location')!.value;
      updateData.organizer = this.eventForm.get('organizer')!.value;
      updateData.isRecurring = this.eventForm.get('recurring')!.value;

      if (this.eventForm.get('description')) {
        updateData.description = this.eventForm.get('description')!.value;
      }
      if (this.eventForm.get('link')) {
        updateData.eventLink = this.eventForm.get('link')!.value;
      }
      if (this.eventForm.get('buttonLabel')) {
        updateData.buttonLabel = this.eventForm.get('buttonLabel')!.value;
      }

      const url = constructBackendRequest(Endpoints.EDIT_EVENT);
      this.http.post(url, updateData).subscribe(data => {
        if (!data) {
          this.openSnackBar("Something went wrong saving the event");
          return;
        }
        this.openSnackBar("Event updated");
        this.closeModal();
      })
    }
    else {
      const newData: any = {};

      if (!this.eventForm.get('name')?.value) {
        this.openSnackBar("Please add an event name");
        return;
      }
      if (!this.eventForm.get('date')?.value) {
        this.openSnackBar("Please set an event date");
        return;
      }

      if (!this.eventForm.get('location')?.value ||
          !this.eventForm.get('organizer')?.value) {
        this.openSnackBar("Please fill out all event information");
        return;
      }

      newData.name = this.eventForm.get('name')!.value;
      newData.date = this.eventForm.get('date')!.value;
      newData.location = this.eventForm.get('location')!.value;
      newData.organizer = this.eventForm.get('organizer')!.value;
      newData.isRecurring = this.eventForm.get('recurring')!.value;

      if (this.eventForm.get('description')) {
        newData.description = this.eventForm.get('description')!.value;
      }
      if (this.eventForm.get('link')) {
        newData.eventLink = this.eventForm.get('link')!.value;
      }
      if (this.eventForm.get('buttonLabel')) {
        newData.buttonLabel = this.eventForm.get('buttonLabel')!.value;
      }


      const url = constructBackendRequest(Endpoints.CREATE_EVENT);
      this.http.post(url, newData).subscribe(data => {
        if (!data) {
          this.openSnackBar("Something went wrong creating the event");
          return;
        }
        this.openSnackBar("Event created");
        this.closeModal();
      })
    }
  }

  openSnackBar(
    message: string,
    verticalPosition: MatSnackBarVerticalPosition = 'bottom',
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    durationInSeconds: number = 3,
  ) {
    this._snackBar.open(message, 'close', {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      duration: durationInSeconds * 1000,
    });
  }

}
