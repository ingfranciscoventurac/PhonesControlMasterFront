// app.config.ts (or wherever you have your appConfig)
import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData, DatePipe } from '@angular/common';
import localeEsDo from '@angular/common/locales/es-DO';

import { routes } from './app.routes';

// register the es-DO locale data once at app start
registerLocaleData(localeEsDo);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // set default locale to Spanish (Dominican Republic)
    { provide: LOCALE_ID, useValue: 'es-DO' },
    // optional: provide DatePipe if you want to inject it in TS
    DatePipe
  ]
};
