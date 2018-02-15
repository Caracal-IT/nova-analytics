import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {GeoLocation} from "../models/spatial/geo-location.type";

@Injectable()
export abstract class SpatialClient {
  abstract getLocation(): Observable<any>;
  abstract getLocationNew(): Observable<GeoLocation>;
}
