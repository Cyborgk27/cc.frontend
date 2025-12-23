import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ApiModule, Configuration } from './core/api';
import { provideHttpClient } from '@angular/common/http';
import { SharedModule } from './shared/shared-module';

@NgModule({
  declarations: [
    App,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApiModule.forRoot(() => {
      return new Configuration({
        basePath: 'https://respectful-unity-production.up.railway.app',
      });
    }),
    SharedModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
  ],
  bootstrap: [App]
})
export class AppModule { }
