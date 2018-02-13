import {Injectable} from "@angular/core";
import {AnalyticsClient} from "./analytics.client.service";
import {LocalizationService} from "./localization.service";

@Injectable()
export class AnalyticsService {
  private static registeredEvents: any = [];
  private readonly sessionId: string;

  constructor(
    private server: AnalyticsClient,
    private localization: LocalizationService
  ){
    this.sessionId = Guid.newGuid();

    this.registerEvents();
  }

  static addEvents(events: any){
    events.forEach((event: any) => AnalyticsService.registeredEvents.push(event));
  }

  registerEvents(){
    for (let evt of AnalyticsService.registeredEvents)
      window.addEventListener(evt.key, (event) => this.logEvent(event, evt), this.isGlobalEvent(evt));
  }

  private isGlobalEvent(event: any): boolean {
    return event.key === "blur" ||
      event.key === "focus" ||
      event.key === "online" ||
      event.key === "offline";
  }

  private logEvent(event: any, eventDefinition: any) {
    if (!this.canLogEvent(event, eventDefinition))
      return;

    let metric:any = this.createMetric(event);

    if (eventDefinition.fields) {
      eventDefinition
        .fields
        .forEach((field: any) => {
          let fieldValue = this.getField(event, field.key);

          if (fieldValue && fieldValue instanceof Object)
            fieldValue = fieldValue.toString();

          metric[field.name] = fieldValue;
        });
    }

    if (event.type == 'load') {
      this
        .localization
        .getLocation()
        .subscribe((geodata: any) => {
          metric["geo_ip"] = geodata.ip;
          metric["geo_country_code"] = geodata.country_code;
          metric["geo_country_name"] = geodata.country_name;
          metric["geo_region_code"] = geodata.region_code;
          metric["geo_region_name"] = geodata.region_name;
          metric["geo_city"] = geodata.city;
          metric["geo_zip_code"] = geodata.zip_code;
          metric["geo_time_zone"] = geodata.time_zone;
          metric["geo_latitude"] = geodata.latitude;
          metric["geo_longitude"] = geodata.longitude;
          metric["geo_location"] = `${geodata.latitude}, ${geodata.longitude}`;

          this.saveMetric(metric);
        }, () =>{
          this.saveMetric(metric);
        });
    }
    else {
      this.saveMetric(metric);
    }
  }

  private canLogEvent(event: any, eventDefinition: any){
    if (!eventDefinition.constraints)
      return true;

    for (let constraint of eventDefinition.constraints) {
      if (!constraint.values)
        continue;

      let value = this.getField(event, constraint.key);

      if (constraint.values.indexOf(",") < 2)
        return value === constraint.values;

      let values = constraint.values.split(",");

      let isValueInList = values
        .filter((filter:any) => filter.trim() == value.trim())
        .length;

      if(isValueInList)
        return true;
    }

    return false;
  }

  private createMetric(event: Event){
    return {
      sessionId: this.sessionId,
      origin: window.location.origin,
      path: window.location.pathname,
      loggedDate: Date(),
      timeStamp: event.timeStamp,
      eventType: event.type,
      component: this.getComponent(event)
    };
  }

  private getComponent(event: any){
    if (!event.path)
      return "";

    const index = event.path.findIndex((item: any) => item.localName == "dynamic-form");

    if (index > 1)
      return event.path[index - 1].localName;

    return "";
  }

  private getField(event: any, key: string) {
    if (key.indexOf(".") < 1)
      return event[key];

    let objValue = event;
    for (let item of key.split(".")){
      if (objValue[item])
        objValue = objValue[item];
      else
        return null;
    }

    return objValue;
  }

  private saveMetric(metric: any) {
    this
      .server
      .indexDocument(metric)
      .subscribe(() => {},(error) => console.log(error));
  }
}

class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
}
