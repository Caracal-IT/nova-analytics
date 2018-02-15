import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";

@Injectable()
export abstract class AnalyticsClient {
  abstract indexDocument(document: any): Observable<any>;
}
