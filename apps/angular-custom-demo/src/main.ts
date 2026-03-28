import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AngularCustomDemoAppComponent } from './app/app';

bootstrapApplication(AngularCustomDemoAppComponent, appConfig)
  .catch((bootstrapError) => console.error(bootstrapError));
