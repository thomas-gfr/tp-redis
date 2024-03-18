import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from "@angular/common/http";

import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { Overlay } from 'primeng/overlay';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
    ),
    provideRouter(routes), 
    provideHttpClient(),
    Overlay,
    provideAnimations(),
  ]
};
