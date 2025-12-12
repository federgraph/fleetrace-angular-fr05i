import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  imports: [CommonModule],
  exports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatOptionModule,
    MatRadioModule,
    ],
})
export class MaterialModule {}
