import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { OnlineServices } from './shared/services';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), OnlineServices],
};
