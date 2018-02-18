import {ModuleWithProviders, NgModule, Provider} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnalyticsService} from "./services/analytics.service";
import {EventService} from "./services/event.service";

@NgModule({
  imports: [
    CommonModule
  ]
})
export class AnalyticsModule {
  public static forRoot(
    providedAnalyticsClient: Provider,
    providedSpatialClient: Provider
  ): ModuleWithProviders {
    return {
      ngModule: AnalyticsModule,
      providers: [
        providedAnalyticsClient,
        providedSpatialClient,
        AnalyticsService,
        EventService
      ]
    };
  }
}
