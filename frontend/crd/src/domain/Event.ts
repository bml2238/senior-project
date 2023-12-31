export interface EventJSON {
  name: string;
  description: string;
  date: string;
  eventID: string;
  isRecurring: boolean;
  organizer: string;
  location: string;
  isRequired: boolean;
}

export class Event {
  constructor(json: EventJSON) {
    this.name = json.name
    this.description = json.description;
    this.date = new Date(json.date);
    this.eventID = json.eventID;
    this.isRecurring = json.isRecurring;
    this.organizer = json.organizer;
    this.location = json.location;
    this.isRequired = json.isRequired;
    // TODO this should be checked through the submission object or provided by the backend later
    this.isComplete = false;
  }

  name: string;
  description: string;
  date: Date;
  eventID: string;
  isRecurring: boolean;
  organizer: string;
  location: string;
  isRequired: boolean;
  isComplete: boolean;
}
