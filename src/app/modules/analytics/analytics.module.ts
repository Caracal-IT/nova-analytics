import {ModuleWithProviders, NgModule, Provider} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnalyticsService} from "./services/analytics.service";
import {LocalizationService} from "./services/localization.service";
import {AnalyticsClient} from "./services/analytics.client.service";
import {NovaCoreLibModule, NovaHttpClient} from "nova-core-lib";

@NgModule({
  imports: [
    CommonModule,
    NovaCoreLibModule.forRoot()
  ],
  declarations: []
})
export class AnalyticsModule {
  public static forRoot(
    providedNovaHttpClient: Provider = {
      provide: NovaHttpClient,
      useClass: NovaHttpClient
    },
    ...configs: Array<any>
  ): ModuleWithProviders {

    for(let config of configs)
      AnalyticsService.addEvents(config.getEvents());

    return {
      ngModule: AnalyticsModule,
      providers: [
      //  providedNovaHttpClient,
        AnalyticsService,
        AnalyticsClient,
        LocalizationService
      ]
    };
  }
}
