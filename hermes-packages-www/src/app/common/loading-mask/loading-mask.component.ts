import { Component, OnInit, NgZone } from '@angular/core';
import {LoadingMaskService} from '../loading-mask.service';

@Component({
  selector: 'app-loading-mask',
  templateUrl: './loading-mask.component.html',
  styleUrls: ['./loading-mask.component.css']
})
export class LoadingMaskComponent implements OnInit {
  private loadingMaskService: LoadingMaskService;
  private zone: NgZone;
  public isVisible: boolean;
  constructor(loadingMaskService: LoadingMaskService, zone: NgZone) {
    this.loadingMaskService = loadingMaskService;
    this.zone = zone;

    this.loadingMaskService.onStateChange(isVisible => {
      this.zone.run(() => {
        this.isVisible = isVisible;
      });
    });
  }

  ngOnInit() {
  }
}
