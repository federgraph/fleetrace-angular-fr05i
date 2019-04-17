import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule} from "./material/material.module";

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { FrSelectRaceComponent } from './fr-select-race/fr-select-race.component';
import { FrSelectTimepointComponent } from './fr-select-timepoint/fr-select-timepoint.component';

import { ConnectionControlComponent } from './connection-control/connection-control.component';
import { TimingButtonsComponent } from './timing-buttons/timing-buttons.component';

import { ONLINE_SERVICES } from "./shared/services";

@NgModule({
  declarations: [
    AppComponent,

    FrSelectRaceComponent,
    FrSelectTimepointComponent,

    ConnectionControlComponent,
    TimingButtonsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [
    ...ONLINE_SERVICES
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
