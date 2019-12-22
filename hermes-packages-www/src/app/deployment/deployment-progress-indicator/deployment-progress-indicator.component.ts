import { Component, OnInit, Input, Output, OnChanges } from '@angular/core';
import {DeploymentService} from '../deployment.service';
import {DeploymentStatusEvent, Deployment} from 'src/app/common/models/domain/Deployment';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-deployment-progress-indicator',
  templateUrl: './deployment-progress-indicator.component.html',
  styleUrls: ['./deployment-progress-indicator.component.css']
})
export class DeploymentProgressIndicatorComponent implements OnInit, OnChanges {
  private visible = false;
  private deploymentService: DeploymentService;
  public displayDialog = true;
  public deploymentEvents: DeploymentStatusEvent[] = [];
  public _deployment: Deployment;
  @Output()
  public closed = new EventEmitter();


  constructor(deploymentService: DeploymentService) {
    this.deploymentService = deploymentService;
  }

  ngOnInit() {
    this.deploymentService.onDeploymentStatusUpdate((event => {
      let found = false;

      for (let i = 0; i < this.deploymentEvents.length; i++) {
        let existingEvent = this.deploymentEvents[i];

        if (existingEvent.eventName === event.eventName) {
          this.deploymentEvents[i] = event;
          found = true;
          break;
        }

      }

      if (!found) {
        this.deploymentEvents.push(event);
      }
    }));
  }

  ngOnChanges() {
    this.deploymentEvents = [];
  }

  @Input()
  set deployment(deployment: Deployment) {
    this.visible = true;
    this._deployment = deployment;
  }

  get deployment(): Deployment {
    return this._deployment;
  }

  closeDialog() {
    this.visible = false;
    this.closed.emit('closed');
    console.log('emitting closed');
  }

}
