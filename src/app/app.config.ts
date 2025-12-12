import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { ONLINE_SERVICES } from './shared/services';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), ONLINE_SERVICES],
};
