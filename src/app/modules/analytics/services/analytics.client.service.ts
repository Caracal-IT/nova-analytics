import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AnalyticsClient {
  constructor(private http: HttpClient){ }

  indexDocument(document: any): Observable<any>{
    return this.http
               .post("/api/analytics", document);
  }

}
