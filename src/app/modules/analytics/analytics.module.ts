import {ModuleWithProviders, NgModule, Provider} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnalyticsService} from "./services/analytics.service";

@NgModule({
  imports: [
    CommonModule
  ]
})
export class AnalyticsModule {
  public static forRoot(
    providedAnalyticsClient: Provider,
    providedSpatialClient: Provider,
    ...configs: Array<any>
  ): ModuleWithProviders {

    for(let config of configs)
      AnalyticsService.addEvents(config.getEvents());

    return {
      ngModule: AnalyticsModule,
      providers: [
        providedAnalyticsClient,
        providedSpatialClient,
        AnalyticsService
      ]
    };
  }
}
