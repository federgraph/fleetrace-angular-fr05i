import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { TimingParams } from '../shared/api.service';
import { TBOManager, TCollectionItem } from '../shared/bo.service';

@Component({
    selector: 'app-timing-buttons',
    templateUrl: './timing-buttons.component.html',
    styleUrls: ['./timing-buttons.component.css']
})
export class TimingButtonsComponent implements OnInit {
    _ba: Array<number> = [];
    
    _race = 1;
    _timepoint = 0;

    get race(): number { return this._race; } 
    get timepoint(): number { return this._timepoint; } 

    @Input() set race(value: number) {
        this._race = value;
        this.update();
    }

    @Input() set timepoint(value: number)  {
        this._timepoint = value;
        this.update();
    }

    @Input() auto = true;

    @Output() timeReceived: EventEmitter<TimingParams> = new EventEmitter();
    @Output() timeCancelled: EventEmitter<TimingParams> = new EventEmitter();
   
    BowTupples: Array<[number, boolean]>;
    Bows: Array<number> = [];
    Bibs: Array<number> = [];

    autoShow: boolean = true;
    countShown: number = 0;

    constructor(public BOManager: TBOManager) {
    }

    ngOnInit() {
        this.update();
    }

    clickBiw(bow: number) {
        const t: TimingParams = {
            race: this.race,
            tp: this.timepoint,
            bib: bow
        };
        
        this.timeCancelled.emit(t);
    }

    clickBow(bow: number) {
        const t: TimingParams = {
            race: this.race,
            tp: this.timepoint,
            bib: bow
        };
        
        this.timeReceived.emit(t);

        let iob: number;
        if (this.auto) {

            //bib and/or bow  may have already been removed (by timeReceived event)

            iob = this.Bibs.indexOf(bow);
            if (iob > -1)
              this.Bibs.splice(iob, 1);

            iob = this.Bows.indexOf(bow);
            if (iob > -1)
              this.Bows.splice(iob, 1);

            this.buildBowTupples();
            this.countShown = this.Bibs.length;
        }
    }
  
    hide() {
        this.autoShow = false;
        this.clear();
    }
    
    show() {
        this.autoShow = true;
        this.fill();
    }

    clear() {
        this.Bows = [];
        this.BowTupples = [];
    }

    fill() {
        this.Bows = this.Bibs.slice();
        this.buildBowTupples();
    }
    
    toggle() {
        if (this.Bows.length > 0)
            this.hide();
        else
            this.show();
    }

    update() {
        this.updateFromTimePoint();
        this.filterOutFinishedBibs();
        this.countShown = this.Bibs.length;
        if (this.autoShow)
            this.fill();
        else
            this.clear();
    }

    updateFromEvent() {
        const ba: Array<number> = [];

        const r = this.check_r(this.race);

        const cl = this.BOManager.BO.CollectionItems;
        let cr: TCollectionItem;
        for (let i = 0; i < cl.length; i++) {
            cr = cl[i];
            const bib = cr.Bib;
            const re = cr.Race[r];
            if (re.OTime === 0 && re.IsOK) {
                ba.push(bib);
            }
        }

        this.Bibs = ba;
    }

    /**
     * if an existing event was loaded, which has no timing info for a time point in a race,
     * but finish position info in the event is present for that race,
     * these bibs (all) should not be available for race timing input,
     * since the entry has already completed that race or is Out.
     */
    filterOutFinishedBibs() {
        const ba: Array<number> = [];

        const r = this.check_r(this._race);

        const cl = this.BOManager.BO.CollectionItems;
        let cr: TCollectionItem;
        for (let i = 0; i < cl.length; i++) {
            cr = cl[i];
            const bib = cr.Bib;
            const re = cr.Race[r];
            if (re.OTime !== 0) {
                ba.push(bib);
            }
        }
    
        this.Bibs = this.Bibs.filter( function( el ) {
            return ba.indexOf( el ) < 0;
        });        
    }
    
    /**
     * Used in FR01 (event only app, there is no race timing included)
     */
    updateFromTimePoint() {
        const ba: Array<number> = [];
        let r = this._race;
        const t = this._timepoint;

        r = this.check_r(r);
                   
        const cl = this.BOManager.BO.CollectionItems;
        let cr: TCollectionItem;
        for (let i = 0; i < cl.length; i++) {
            cr = cl[i];
            const bib = cr.Bib;
            const re = cr.Race[r];
            const tp = re.IT[t];
            if (tp && !tp.TimePresent && re.IsOK) {
                ba.push(bib);
            }
        }

        this.Bibs = ba;
    }
 
    buildBowTupples() {
        let bt: [number, boolean];
        const bts: Array<[number, boolean]> = [];

        const l = this.BOManager.BO.StartlistCount;

        for (let i = 1; i <= l; i++) {
            if (this.Bibs.includes(i))
                bt = [i, true];
            else
                bt = [i, false];
            bts.push(bt);
        }

        this.BowTupples = bts;
    }
 
    check_r(r: number): number {
        if (r > this.BOManager.BO.RaceCount)
            r = this.BOManager.BO.RaceCount;
        return r;
    }
}
