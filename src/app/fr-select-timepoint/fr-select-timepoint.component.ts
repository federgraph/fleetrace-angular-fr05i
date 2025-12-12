import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MaterialModule } from '../material/material.module';

@Component({
  imports: [MaterialModule],
  selector: 'app-fr-select-timepoint',
  templateUrl: './fr-select-timepoint.component.html',
  styleUrls: ['./fr-select-timepoint.component.css'],
})
export class FrSelectTimepointComponent {
  numbers: number[] = [];

  fITCount = 1;

  get itCount(): number {
    return this.fITCount;
  }

  @Input() set itCount(value: number) {
    this.fITCount = value;
    this.update();
  }

  @Output() timePointChanged = new EventEmitter<number>();

 constructor() {
    this.update();
  }

  click(value: number): void {
    this.timePointChanged.emit(value);
  }

  update(): void {
    this.numbers = Array.from(Array(this.itCount).keys());
  }
}
