import {Injectable} from "@angular/core";
import {AnalyticsClient} from "../clients/analytics.client";
import {SpatialClient} from "../clients/spatial.client";
import {GeoLocation} from "../models/spatial/geo-location.type";
import {EventService} from "./event.service";

@Injectable()
export class AnalyticsService {
  private readonly sessionId: string;

  constructor(
    private events: EventService,
    private server: AnalyticsClient,
    private spatialClient: SpatialClient
  ){
    this.sessionId = Guid.newGuid();

    this.registerEvents();
  }

  registerEvents(){
    this.events.getEvents().forEach(evt =>
      window.addEventListener(evt.key, (event) => this.logEvent(event, evt), this.isGlobalEvent(evt))
    );
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
        .spatialClient
        .getLocationNew()
        .subscribe((geoLocation: any) => {
          this.mapGeoLocationFields(metric, geoLocation);

          this.saveMetric(metric);
        }, () =>{
          this.saveMetric(metric);
        });
    }
    else {
      this.saveMetric(metric);
    }
  }

  private mapGeoLocationFields(metric: any, geoLocation: GeoLocation) {
    metric["geo_country_code"] = geoLocation.country.key;
    metric["geo_country_name"] = geoLocation.country.value;
    metric["geo_region_code"] = geoLocation.region.key;
    metric["geo_region_name"] = geoLocation.region.value;
    metric["geo_city"] = geoLocation.city;
    metric["geo_time_zone"] = geoLocation.timeZone;
    metric["geo_latitude"] = geoLocation.latitude;
    metric["geo_longitude"] = geoLocation.longitude;
    metric["geo_location"] = `${geoLocation.latitude}, ${geoLocation.longitude}`;
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

      let isValueInList =
        values
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
