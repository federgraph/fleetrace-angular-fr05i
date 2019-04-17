import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
  MatButtonModule,
  MatButtonToggleModule,
  MatInputModule,
  MatOptionModule,
  MatRadioModule,
  } from '@angular/material';


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatOptionModule,
    MatRadioModule,
    ]
})
export class MaterialModule {

}
