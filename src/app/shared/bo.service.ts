import { Injectable } from "@angular/core";
import { TMsgParser2, TMsgType, TMsgInfo } from './bo.msg-parser-simple';

export class TTimepointEntry {
    Time: string = "";
    get TimePresent(): boolean {
        return this.Time !== "";
    }
    clear() {
        this.Time = "";
    }
}

export class TRaceEntry {
    Rank: number = 0;
    OTime: number = 0;
    QU: string = "ok";

    get IsOut(): boolean {
        return this.QU !== "ok";
    }

    get IsOK(): boolean {
        return this.QU === "ok";
    }

    set RaceValue(value: string) {
        // not implemented yet
    }

    IT: Array<TTimepointEntry>;

    constructor(private BO: TBO) {
        this.IT = new Array<TTimepointEntry>(this.BO.ITCount + 1);
        for (let i = 0; i < this.IT.length; i++) {
            this.IT[i] = new TTimepointEntry();
        }
    }

    clear() {
        this.OTime = 0;
        this.QU = "ok";
        for (let tp = 0; tp < this.IT.length; tp++) {
            this.IT[tp].clear();
        }
    }

    clearTimepoint(tp: number) {
        if (tp >= 0 && tp < this.IT.length)
            this.IT[tp].clear();
    }
}

export class TCollectionItem {
    Race: Array<TRaceEntry>;

    constructor(
        private BO: TBO,
        public Bib: number) {
        this.Race = new Array<TRaceEntry>(this.BO.RaceCount + 1);
        for (let i = 0; i < this.Race.length; i++) {
            this.Race[i] = new TRaceEntry(this.BO);
        }
    }
}

export class TBO {
    Name: string = "Default Event";
    StrictMode: boolean = true;

    CollectionItems: Array<TCollectionItem> = new Array<TCollectionItem>(8);

    constructor(
        public RaceCount: number = 2,
        public ITCount: number = 2,
        public StartlistCount = 8,
    ) {
        this.CollectionItems = new Array<TCollectionItem>(this.StartlistCount);
        for (let i = 0; i < this.CollectionItems.length; i++) {
            this.CollectionItems[i] = new TCollectionItem(this, i + 1);
        }
    }

    checkDim(rc: number, tc: number, sc: number): boolean {
        if (rc !== this.RaceCount) return false;
        if (tc !== this.ITCount) return false;
        if (sc !== this.StartlistCount) return false;

        return true;
    }

    findBib(bib: number): TCollectionItem {
        return this.CollectionItems[bib - 1];
    }

    clear() {
        for (let i = 0; i < this.CollectionItems.length; i++) {
            const cr = this.CollectionItems[i];
            for (let r = 1; r < cr.Race.length; r++) {
                cr.Race[r].clear();
            }
        }
    }

    clearRace(r: number) {
        for (let i = 0; i < this.CollectionItems.length; i++) {
            const cr = this.CollectionItems[i];
            if (r >= 1 && r < cr.Race.length) {
                cr.Race[r].clear();
            }
        }
    }

    clearTimepoint(r: number, tp: number) {
        for (let i = 0; i < this.CollectionItems.length; i++) {
            const cr = this.CollectionItems[i];
            if (r >= 1 && r < cr.Race.length) {
                cr.Race[r].clearTimepoint(tp);
            }
        }
    }

    handleQU(r: number, bib: number, value: string) {
        //this.findBib(bib).Race[r].QU = value;
        const cr = this.findBib(bib);
        if (cr) {
            if (r < cr.Race.length) {
                const race = cr.Race[r];
                if (race) {
                    race.QU = value;
                }
            }
        }
    }

    handleRank(r: number, bib: number, value: number) {
        //this.findBib(bib).Race[r].Rank = value;
        const cr = this.findBib(bib);
        if (cr) {
            if (r < cr.Race.length) {
                const race = cr.Race[r];
                if (race) {
                    race.Rank = value;
                }
            }
        }
    }

    handleRV(r: number, bib: number, value: string) {
        //this.findBib(bib).Race[r].RaceValue = value;
        const cr = this.findBib(bib);
        if (cr) {
            if (r < cr.Race.length) {
                const race = cr.Race[r];
                if (race) {
                    race.RaceValue = value;
                }
            }
        }
    }

    handleTime(r: number, bib: number, tp: number, value: string) {
        //this.findBib(bib).Race[r].IT[tp].Time = value;
        const cr = this.findBib(bib);
        if (cr) {
            if (r < cr.Race.length) {
                const race = cr.Race[r];
                if (race) {
                    if (tp < race.IT.length) {
                        const timePoint = race.IT[tp];
                        if (timePoint) {
                            timePoint.Time = value;
                        }
                    }
                }
            }
        }
    }

}

@Injectable()
export class TBOManager {
    BO: TBO;

    MP: TMsgParser2;

    constructor() {
        this.BO = new TBO;
        this.MP = new TMsgParser2();
    }

    recreate(rc: number, tc: number, sc: number) {
        if (rc < 1) rc = 1;
        if (tc < 0) rc = 0;
        if (sc < 2) sc = 2;

        if (rc > 20) rc = 20;
        if (tc > 10) rc = 10;
        if (sc > 120) sc = 120;

        this.BO = new TBO(rc, tc, sc);
    }

    processBackup(ML: string[]) {

        let rc: number = 2;
        let tc: number = 0;
        let sc: number = 2;
        let en: string = "Test Event";
        let im: boolean = true;

        const ml: TMsgInfo[] = []; //Array<TMsgInfo> =  new Array<TMsgInfo>();

        let s: string = "";
        for (let i = 0; i < ML.length; i++) {
            s = ML[i];
            this.MP.parseLine(s);
            switch (this.MP.MsgType) {
                case TMsgType.mtRaceCount: 
                    rc = this.MP.RaceCount;
                    break;

                case TMsgType.mtITCount: 
                    tc = this.MP.ITCount;
                    break;

                case TMsgType.mtStartlistCount: 
                    sc = this.MP.StartlistCount;
                    break;

                case TMsgType.mtNone:
                    break;

                case TMsgType.mtEventName: 
                    en = this.MP.EventName;
                    break;

                case TMsgType.mtInputMode: 
                    im = this.MP.InputMode;
                    break;

                default: 
                    ml.push(this.MP.Info);
                    break;
            }
        }

        if (!this.BO.checkDim(rc, tc, sc)) {
            this.recreate(rc, tc, sc);
        }
        else {
            this.BO.clear();
        }

        this.BO.Name = en;
        this.BO.StrictMode = im;

        ml.forEach(m => {
            switch (m.MsgType) {
                case TMsgType.mtRank:
                    rc = this.MP.RaceCount;
                    this.BO.handleRank(m.Race, m.Bib, m.Rank);
                    break;

                case TMsgType.mtTime:
                    tc = this.MP.ITCount;
                    this.BO.handleTime(m.Race, m.Bib, m.IT, m.Time);
                    break;

                case TMsgType.mtQU:
                    rc = this.MP.StartlistCount;
                    this.BO.handleQU(m.Race, m.Bib, m.QU);
                    break;

                case TMsgType.mtRV:
                    //do nothing
                    break;
            }

        });

    }

}
