import {Injectable} from "@angular/core";

@Injectable()
export class EventService {
  registeredEvents = [];

  addEvents(events){
    events.forEach((event: any) => this.registeredEvents.push(event));
  }

  getEvents() {
    return this.registeredEvents;
  }
}
