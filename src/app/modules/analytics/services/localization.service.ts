import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class LocalizationService {
  constructor(private http: HttpClient){ }

  getLocation(): Observable<any>{
    return this.http
               .get("//freegeoip.net/json/?callback=");
  }
}
