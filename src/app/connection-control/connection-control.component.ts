import { Component, Output, EventEmitter, inject } from '@angular/core';

import { ApiService } from '../shared/api.service';
import { EventParams } from '../shared/data-model';
import { MaterialModule } from '../material/material.module';

enum AmpelColor {
    white,
    red,
    yellow,
    green,
  gray,
}

@Component({
    selector: 'app-connection-control',
    imports: [MaterialModule],
    templateUrl: './connection-control.component.html',
    styleUrls: ['./connection-control.component.css'],
})
export class ConnectionControlComponent {
    private isConnected = false;
    led: AmpelColor = AmpelColor.yellow;
    ledColor = 'red';

    dataMsg = '';
    errorMsg = '';
    flashMsg = '';

  @Output() paramsChanged = new EventEmitter<EventParams>();

    eventParams: EventParams = new EventParams();

  private apiService = inject(ApiService);

  constructor() {
        this.updateLEDColor();
    }

    handleError(err: any): void {
        this.setConnected(false);
        this.errorMsg = `status: ${err.status} url: ${err.url}`;
    }

    updateFlash(s: string): void {
        this.dataMsg = '';
        this.errorMsg = '';
        this.flashMsg = s;
    }

    connectBtnClick(): void {
        this.led = AmpelColor.white;
        this.updateFlash('connect');
        this.apiService.inputWireConnect().subscribe(
            (data) => {
                this.dataMsg = data;
                this.led = AmpelColor.green;
                this.setConnected(true);
            },
            (err) => {
                this.handleError(err);
                this.led = AmpelColor.gray;
                this.setConnected(false);
      },
        );
    }

    disconnectBtnClick(): void {
        this.led = AmpelColor.white;
        this.updateFlash('disconnect');
        this.apiService.inputWireDisconnect().subscribe(
            (data) => {
                this.dataMsg = data;
                this.led = AmpelColor.red;
                this.setConnected(false);
            },
            (err) => {
                this.handleError(err);
                this.led = AmpelColor.gray;
                this.setConnected(false);
      },
        );
    }

    queryBtnClick(): void {
        this.updateFlash('query');
        this.apiService.queryParams().subscribe(
            (data) => {
                if (data) {
                    this.eventParams.raceCount = data.raceCount;
                    this.eventParams.itCount = data.itCount;
                    this.eventParams.startlistCount = data.startlistCount;
                    this.paramsChanged.emit(this.eventParams);
                    this.led = AmpelColor.green;
                    this.setConnected(true);
                } else {
                    this.dataMsg = 'please check response for querParams';
                }
            },
      (err) => this.handleError(err),
        );
    }

    clearBtnClick(): void {
        this.updateFlash('clear');
        this.apiService.manageClear().subscribe(
            (res) => {
                if (res) {
                    this.dataMsg = res;
                } else {
                    this.dataMsg = 'please check response for clear';
                }
            },
      (err) => this.handleError(err),
        );
    }

    testBtnClick(): void {
        this.updateFlash('test');
        this.apiService.getConnectionStatus().subscribe(
            (data) => {
                if (data.connected) {
                    this.dataMsg = 'connected';
                    this.led = AmpelColor.green;
                    this.setConnected(true);
                } else {
                    this.dataMsg = 'not connected';
                    this.led = AmpelColor.red;
                    this.setConnected(false);
                }
            },
      (err) => this.handleError(err),
        );
    }

    updateLEDColor(): void {
        switch (this.led) {
      case AmpelColor.white:
        this.ledColor = 'white';
        break;
      case AmpelColor.red:
        this.ledColor = 'red';
        break;
      case AmpelColor.yellow:
        this.ledColor = 'yellow';
        break;
      case AmpelColor.green:
        this.ledColor = 'lime';
        break;
      default:
        this.ledColor = 'gray';
        break;
        }
    }

    getConnected(): boolean {
        return this.isConnected;
    }

    setConnected(value: boolean): void {
        this.isConnected = value;
        this.updateLEDColor();
    }

    logBtnClick(): void {
        if (this.dataMsg !== '') {
            console.log('dataMsg = ' + this.dataMsg);
        }
        if (this.errorMsg !== '') {
            console.log('errorMsg = ' + this.errorMsg);
        }
        if (this.flashMsg !== '') {
            console.log('flashMsg = ' + this.flashMsg);
        }
    }

    superClear(): void {
        this.clearBtnClick();
        this.queryBtnClick();
    }
}
