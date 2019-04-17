import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-fr-select-timepoint',
  templateUrl: './fr-select-timepoint.component.html',
  styleUrls: ['./fr-select-timepoint.component.css']
})
export class FrSelectTimepointComponent {

  numbers: Array<number> = [];

  _itCount: number = 1;

  get itCount(): number { 
    return this._itCount;
  }

  @Input() set itCount(value: number) {
    this._itCount = value;
    this.update();
  }

  @Output() timePointChanged: EventEmitter<number> = new EventEmitter();

 constructor () { 
    this.update();
  }

  click(value: number) {
    this.timePointChanged.emit(value);
  }

  update() {
    this.numbers = Array.from(Array(this.itCount).keys());
  }

}
