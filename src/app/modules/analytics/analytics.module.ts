import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnalyticsService} from "./services/analytics.service";
import {LocalizationService} from "./services/localization.service";
import {AnalyticsClient} from "./services/analytics.client.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class AnalyticsModule {
  public static forRoot(...configs: Array<any>): ModuleWithProviders {
    for(let config of configs)
      AnalyticsService.addEvents(config.getEvents());

    return {
      ngModule: AnalyticsModule,
      providers: [
        AnalyticsService,
        AnalyticsClient,
        LocalizationService
      ]
    };
  }
}
