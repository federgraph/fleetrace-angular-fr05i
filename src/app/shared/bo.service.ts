import { Injectable } from '@angular/core';
import { TMsgParser2, TMsgType, TMsgInfo } from './bo.msg-parser-simple';

export class TTimepointEntry {
  Time = '';
  get TimePresent(): boolean {
    return this.Time !== '';
  }
  clear(): void {
    this.Time = '';
  }
}

export class TRaceEntry {
  Rank = 0;
  OTime = 0;
  QU = 'ok';

  get IsOut(): boolean {
    return this.QU !== 'ok';
  }

  get IsOK(): boolean {
    return this.QU === 'ok';
  }

  set RaceValue(value: string) {
    // not implemented yet
  }

  IT: TTimepointEntry[];

  constructor(private BO: TBO) {
    this.IT = new Array<TTimepointEntry>(this.BO.ITCount + 1);
    for (let i = 0; i < this.IT.length; i++) {
      this.IT[i] = new TTimepointEntry();
    }
  }

  clear(): void {
    this.OTime = 0;
    this.QU = 'ok';
    for (const tpe of this.IT) {
      tpe.clear();
    }
  }

  clearTimepoint(tp: number): void {
    if (tp >= 0 && tp < this.IT.length) {
      this.IT[tp].clear();
    }
  }
}

export class TCollectionItem {
  Race: TRaceEntry[];

  constructor(
    private BO: TBO,
    public Bib: number,
  ) {
    this.Race = new Array<TRaceEntry>(this.BO.RaceCount + 1);
    for (let i = 0; i < this.Race.length; i++) {
      this.Race[i] = new TRaceEntry(this.BO);
    }
  }
}

export class TBO {
  Name = 'Default Event';
  StrictMode = true;

  CollectionItems: TCollectionItem[] = new Array<TCollectionItem>(8);

  constructor(
    public RaceCount = 2,
    public ITCount = 2,
    public StartlistCount = 8,
  ) {
    this.CollectionItems = new Array<TCollectionItem>(this.StartlistCount);
    for (let i = 0; i < this.CollectionItems.length; i++) {
      this.CollectionItems[i] = new TCollectionItem(this, i + 1);
    }
  }

  checkDim(rc: number, tc: number, sc: number): boolean {
    if (rc !== this.RaceCount) {
      return false;
    }
    if (tc !== this.ITCount) {
      return false;
    }
    if (sc !== this.StartlistCount) {
      return false;
    }
    return true;
  }

  findBib(bib: number): TCollectionItem {
    return this.CollectionItems[bib - 1];
  }

  clear(): void {
    for (const cr of this.CollectionItems) {
      for (let r = 1; r < cr.Race.length; r++) {
        cr.Race[r].clear();
      }
    }
  }

  clearRace(r: number): void {
    for (const cr of this.CollectionItems) {
      if (r >= 1 && r < cr.Race.length) {
        cr.Race[r].clear();
      }
    }
  }

  clearTimepoint(r: number, tp: number): void {
    for (const cr of this.CollectionItems) {
      if (r >= 1 && r < cr.Race.length) {
        cr.Race[r].clearTimepoint(tp);
      }
    }
  }

  handleQU(r: number, bib: number, value: string): void {
    // this.findBib(bib).Race[r].QU = value;
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

  handleRank(r: number, bib: number, value: number): void {
    // this.findBib(bib).Race[r].Rank = value;
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

  handleRV(r: number, bib: number, value: string): void {
    // this.findBib(bib).Race[r].RaceValue = value;
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

  handleTime(r: number, bib: number, tp: number, value: string): void {
    // this.findBib(bib).Race[r].IT[tp].Time = value;
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
    this.BO = new TBO();
    this.MP = new TMsgParser2();
  }

  recreate(rc: number, tc: number, sc: number): void {
    if (rc < 1) {
      rc = 1;
    }
    if (tc < 0) {
      rc = 0;
    }
    if (sc < 2) {
      sc = 2;
    }

    if (rc > 20) {
      rc = 20;
    }
    if (tc > 10) {
      rc = 10;
    }
    if (sc > 120) {
      sc = 120;
    }

    this.BO = new TBO(rc, tc, sc);
  }

  processBackup(ML: string[]): void {
    let rc = 2;
    let tc = 0;
    let sc = 2;
    let en = 'Test Event';
    let im = true;

    const ml: TMsgInfo[] = [];

    let s = '';
    for (s of ML) {
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
    } else {
      this.BO.clear();
    }

    this.BO.Name = en;
    this.BO.StrictMode = im;

    ml.forEach((m) => {
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
          // do nothing
          break;
      }
    });
  }
}
