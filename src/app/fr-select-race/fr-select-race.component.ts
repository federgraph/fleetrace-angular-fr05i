import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-fr-select-race',
  templateUrl: './fr-select-race.component.html',
  styleUrls: ['./fr-select-race.component.css']
})
export class FrSelectRaceComponent {

  numbers: Array<number> = [];

  _raceCount: number = 1;

  get raceCount(): number { return this._raceCount; } 

  @Input() set raceCount(value: number) {
    this._raceCount = value;
    this.update();
  }
  
  @Output() raceChanged: EventEmitter<number> = new EventEmitter();

  constructor() { }

  click(value: number) {
    this.raceChanged.emit(value);
  }

  update() {
    // generate [0, 1, ... , raceCount-2]
    let t = Array.from(Array(this.raceCount - 1).keys());
    // map to [2, 3, ... , raceCount]
    t = t.map( (value, index) => value + 2);
    this.numbers = t;
  }

}
