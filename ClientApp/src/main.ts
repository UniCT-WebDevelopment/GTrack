import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function getBaseUrl() {
  if(environment.production){
    let url = window.location.origin+"/api/";
    return url
  }
  else
    return "http://localhost:5001/api/"
}

if (environment.production) {

  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
