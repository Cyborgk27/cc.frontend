import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ApiModule, Configuration } from './core/api';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { SharedModule } from './shared/shared-module';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { environment } from '../environments/environment.development';
import { errorInterceptor } from './core/interceptors/error.interceptor';

@NgModule({
  declarations: [
    App,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApiModule,
    SharedModule
  ],
  providers: [
    {
      provide: Configuration,
      useFactory: () => new Configuration({
        basePath: environment.urlAddress,
      })
    },
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor
      ])
    ),
  ],
  bootstrap: [App]
})
export class AppModule { }
