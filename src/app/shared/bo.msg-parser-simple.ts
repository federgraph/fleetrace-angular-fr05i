export enum TMsgType {
    mtNone,
    mtRaceCount,
    mtITCount,
    mtStartlistCount,
    mtEventName,
    mtInputMode,
    mtRank,
    mtQU,
    mtRV,
    mtTime
}

const creRK = /^FR.*.W(\d+).Bib(\d+).Rank=(-*\d+)$/;
const creRV = /^FR.*.W(\d+).Bib(\d+).RV=(-*\d+)$/;
const creFT = /^FR.*.W(\d+).Bib(\d+).FT=(\S+)$/;
const creIT = /^FR.*.W(\d+).Bib(\d+).IT(\d+)=(\S+)$/;
const creQU = /^FR.*.W(\d+).Bib(\d+).QU=(dns|dnf|dsq|ok)$/i;
const creRC = /^DP.RaceCount=(\d+)$/;
const creIC = /^DP.ITCount=(\d+)$/;
const creSC = /^DP.StartlistCount=(\d+)$/;
const creEN = /^EP.Name=(\w+\s*\w+)$/;
const creIM = /^EP.(IM|InputMode)=(Strict|Relaxed)$/;

export class TMsgInfo {
    MsgType: TMsgType;

    Race: number;
    IT: number;
    Bib: number;

    Value: string;
    Rank: number;
    Time: string;
    QU: string;
}

export class TMsgParser2 {

    sDivision: string;
    sRace: string;
    sBib: string;
    sIT: string;

    sValue: string;

    sRank: string;
    sTime: string;
    sQU: string;

    gc: number;
    g1: string;
    g2: string;
    g3: string;
    g4: string;

    MsgType: TMsgType;

    StartlistCount: number;
    RaceCount: number;
    ITCount: number;

    EventName: string;
    InputMode: boolean;

    Race: number;
    IT: number;
    Bib: number;
    Rank: number;

    ErrorMsg: string;

    resetGroups(): void {
        this.gc = 0;
        this.g1 = 'g1';
        this.g2 = 'g2';
        this.g3 = 'g3';
        this.g4 = 'g4';
    }

    resetVars(): void {
        this.ErrorMsg = '';
        this.MsgType = TMsgType.mtNone;

        this.RaceCount = 2;
        this.ITCount = 0;
        this.StartlistCount = 8;

        this.EventName = 'EN';
        this.InputMode = false;

        this.sDivision = '*';
        this.sRace = '0';
        this.sIT = '0';
        this.sBib = '0';
        this.sRank = '0';
        this.sTime = '00:00:00.00';
        this.sQU = 'ok';
        this.sValue = '';
    }

    test(s: string): void {

    }

    initTestData(ML: string[]): void {
        ML = [];
        ML.push('DP.RaceCount = 3');
        ML.push('DP.ITCount = 2');
        ML.push('DP.StartlistCount=7');
        ML.push('');
        ML.push('EP.Name = TestEvent');
        ML.push('EP.Name = Test Event');
        ML.push('');
        ML.push('FR.*.W1.Bib5.QU=dns');
        ML.push('FR.*.W2.Bib6.QU=dsq');
        ML.push('FR.*.W3.Bib7.QU =dnf');
        ML.push('FR.*.W4.Bib8.QU =ok');
        ML.push('');
        ML.push('FR.*.W1.Bib5.Rank=1');
        ML.push('FR.*.W2.Bib6.Rank = 22');
        ML.push('FR.*.W3.Bib7.Rank= 333');
        ML.push('FR.*.W4.Bib8.Rank=-1');
        ML.push('');
        ML.push('FR.Division.W97.Bib98.RV=99');
        ML.push('FR.*.W51.Bib52.RV = 53');
        ML.push('FR.*.W5.Bib7.RV=-1');
        ML.push('');
        ML.push('FR.*.W1.Bib2.FT=12:03:58.20');
        ML.push('FR.*.W1.Bib3.IT1=12:03:57.23');
        ML.push('FR.420.W22.Bib34.IT2 = 05:03:57.21');
        ML.push('FR.Cadet.W103.Bib52.IT3=12:44:55.66');
        ML.push('');
        ML.push('EP.IM = Strict');
        ML.push('EP.IM = Relaxed');
    }

    genOne(mt: TMsgType): string {
        switch (mt) {
            case TMsgType.mtRaceCount:
                return `DP.RaceCount=${this.RaceCount}`;
            case TMsgType.mtITCount:
                return `DP.ITCount=${this.ITCount}`;
            case TMsgType.mtStartlistCount:
                return `DP.StartlistCount=${this.StartlistCount}`;

            case TMsgType.mtEventName:
                return `EP.Name=${this.EventName}`;

            case TMsgType.mtInputMode:
                if (this.InputMode) {
                    return 'EP.IM=Strict';
                } else {
                    return 'EP.IM=Relaxed';
                }

            case TMsgType.mtQU:
                return `FR.*.W${this.Race}.Bib${this.Bib}.QU=${this.sQU}`;
            case TMsgType.mtRank:
                return `FR.*.W${this.Race}.Bib${this.Bib}.Rank=${this.sRank}`;
            case TMsgType.mtRV:
                return `FR.*.W${this.Race}.Bib${this.Bib}.RV=${this.sValue}`;

            case TMsgType.mtTime:
                return `FR.*.W${this.Race}.Bib${this.Bib}.IT${this.IT}=${this.sTime}`;

            default:
                return '?';
        }
    }

    genMsg(): string {
        return this.genOne(this.MsgType);
    }

    genAll(ML: string[]): void {
        for (let mt = TMsgType.mtRaceCount; mt < TMsgType.mtTime; mt++) {
            ML.push(this.genOne(mt));
        }
    }

    trimLine(s: string): string {
        const i = s.indexOf('=');
        if (i > -1) {
            return s.substring(0, i).trim() + '=' + s.substring(i + 1, s.length).trim();
        } else {
            return s.trim();
        }
    }

    parseLine(ALine: string): boolean {

        this.resetGroups();
        this.resetVars();

        const t = this.trimLine(ALine);

        const result = this.parseLn(t);

        this.Race = this.StrToIntDef(this.sRace, 99);
        this.IT = this.StrToIntDef(this.sIT, 99);
        this.Bib = this.StrToIntDef(this.sBib, 99);
        this.Rank = this.StrToIntDef(this.sRank, 0);

        return result;
    }

    StrToIntDef(value: string, defaultResult: number): number {
        let i = Number.parseInt(value, 10);
        if (Number.isNaN(i)) {
            i = defaultResult;
        }
        return i;
    }

    retrieveGroupMatch(mc: RegExpMatchArray): number {
        this.gc = 0;
        if (!mc) {
            return 0;
        }
        if (mc.length > 0) {
            this.gc = mc.length;
            if (this.gc > 4) {
                this.g4 = mc[4];
            }
            if (this.gc > 3) {
                this.g3 = mc[3];
            }
            if (this.gc > 2) {
                this.g2 = mc[2];
            }
            if (this.gc > 1) {
                this.g1 = mc[1];
        }
        }
        return this.gc;
    }

    parseLn(t: string): boolean {
        let mc: RegExpMatchArray;

        // 'FR.*.W1.Bib3.Rank = 5'
        mc = creRK.exec(t);
        if (mc && this.retrieveGroupMatch(mc) === 4) {
            this.MsgType = TMsgType.mtRank;
            this.sDivision = '*';
            this.sRace = this.g1;
            this.sBib = this.g2;
            this.sRank = this.g3;
            this.sValue = this.g3;
            return true;
        }

        // 'FR.*.W1.Bib2.FT = 12:03:58.20'
        mc = creFT.exec(t);
        if (mc && this.retrieveGroupMatch(mc) === 4) {
            this.MsgType = TMsgType.mtTime;
            this.sDivision = '*';
            this.sRace = this.g1;
            this.sBib = this.g2;
            this.sIT = '0';
            this.sTime = this.g3;
            this.sValue = this.g3;
            return true;
        }

        // 'FR.420.W22.Bib34.IT2 = 05:03:57.21'
        mc = creIT.exec(t);
        if (mc && this.retrieveGroupMatch(mc) === 5) {
            this.MsgType = TMsgType.mtTime;
            this.sDivision = '*';
            this.sRace = this.g1;
            this.sBib = this.g2;
            this.sIT = this.g3;
            this.sTime = this.g4;
            this.sValue = this.g4;
            return true;
        }

        // 'FR.*.W1.Bib3.QU = dnf'
        mc = creQU.exec(t);
        if (mc && this.retrieveGroupMatch(mc) === 4) {
            this.MsgType = TMsgType.mtQU;
            this.sDivision = '*';
            this.sRace = this.g1;
            this.sBib = this.g2;
            this.sQU = this.g3;
            this.sValue = this.g3;
            return true;
        }

        // 'FR.*.W1.Bib1.RV = 500'
        mc = creRV.exec(t);
        if (mc && this.retrieveGroupMatch(mc) === 4) {
            this.MsgType = TMsgType.mtRV;
            this.sDivision = '*';
            this.sRace = this.g1;
            this.sBib = this.g2;
            this.sValue = this.g3;
            return true;
        }

        // 'DP.RaceCount = 2'
        mc = creRC.exec(t);
        if (mc && this.retrieveGroupMatch(mc) === 2) {
            this.MsgType = TMsgType.mtRaceCount;
            this.RaceCount = this.StrToIntDef(this.g1, 2);
            this.sValue = this.g1;
            return true;
        }

        // 'DP.ITCount = 1'
        mc = creIC.exec(t);
        if (mc && this.retrieveGroupMatch(mc) === 2) {
            this.MsgType = TMsgType.mtITCount;
            this.ITCount = this.StrToIntDef(this.g1, 0);
            this.sIT = this.g1;
            this.sValue = this.g1;
            return true;
        }

        // 'DP.StartistCount = 8'
        mc = creSC.exec(t);
        if (mc && this.retrieveGroupMatch(mc) === 2) {
            this.MsgType = TMsgType.mtStartlistCount;
            this.StartlistCount = this.StrToIntDef(this.g1, 8);
            this.sValue = this.g1;
            return true;
        }

        // 'EP.Name = Test Event'
        mc = creEN.exec(t);
        if (mc && this.retrieveGroupMatch(mc) === 2) {
            this.MsgType = TMsgType.mtEventName;
            this.sValue = this.g1;
            return true;
        }

        // 'EP.Strict = True'
        mc = creIM.exec(t);
        if (mc && this.retrieveGroupMatch(mc) === 3) {
            this.MsgType = TMsgType.mtInputMode;
            this.InputMode = this.g2 === 'Strict';
            this.sValue = this.g2;
            return true;
        }

        return false;
    }

    get Info(): TMsgInfo {
        const info = new TMsgInfo();

        info.MsgType = this.MsgType;

        info.Race = this.Race;
        info.IT = this.IT;
        info.Bib = this.Bib;
        info.Value = this.sValue;

        info.Rank = this.Rank;
        info.Time = this.sTime;
        info.QU = this.sQU;

        return info;
    }

}

