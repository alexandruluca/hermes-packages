import {Injectable, NgZone} from '@angular/core';
import {Api} from '../common/api.service';
import {Deployment, DeploymentField, DeploymentStatus, DeploymentStatusEvent, PullRequestStatus, DeploymentBand} from '../common/models/domain/Deployment';
import {ServerDeployment} from '../common/models/domain/ServerDeployment';
import {Subject, Observable} from 'rxjs';
import io from 'socket.io-client';
import {Config} from '../common/config.service';
import {PageResult, PageRequest} from '../common/models/domain/Page';
import {DeploymentContext} from '../common/models/domain/DeploymentContext';

@Injectable({
  providedIn: 'root'
})
export class DeploymentService {
  private clientInstance;
  private socket;
  private serverListSubject = new Subject<any>();
  private serverListObservable = this.serverListSubject.asObservable();

  private applicationUpdatedSubject = new Subject<any>();
  private applicationUpdatedObservable = this.applicationUpdatedSubject.asObservable();

  private packageUpdaterConnectedSubject = new Subject<any>();
  private packageUpdaterConnectedObservable = this.packageUpdaterConnectedSubject.asObservable();

  private deploymentStatusUpdateSubject = new Subject<any>();
  private deploymentStatusUpdateSObservable: Observable<any> = this.deploymentStatusUpdateSubject.asObservable();
  private zone: NgZone;
  private config: Config;

  constructor(api: Api, zone: NgZone, config: Config) {
    this.zone = zone;
    this.config = config;
    this.clientInstance = api.clientInstance;

    this.socket = io(`${config.locationOrigin}?web-client=true`);

    this.socket.on('client-update-available', () => {
      this.zone.run(() => {
        this.serverListSubject.next();
      });
    });

    this.socket.on('deployment-status-update', (event) => {
      this.zone.run(() => {
        this.deploymentStatusUpdateSubject.next(event);
      });
    });

    this.socket.on('application-updated', (appMeta) => {
      this.zone.run(() => {
        this.applicationUpdatedSubject.next(appMeta);
      });
    });

    this.socket.on('package-updater-connected', () => {
      this.zone.run(() => {
        this.packageUpdaterConnectedSubject.next();
      });
    });
  }

  async getDeployments(options: PageRequest): Promise<PageResult<Deployment>> {
    const pageResult: PageResult<Deployment> = await this.clientInstance.apis.deployments.getDeployments({options});

    pageResult.items.forEach(deployment => {
      if (deployment.pullRequestMeta && deployment.pullRequestMeta.sourceBranch) {}
      this.addDeploymentMetaInfo(deployment);
    });

    return pageResult;
  }

  onServerListChanged(func: () => any) {
    this.serverListObservable.subscribe(func);
  }

/**
 * Register listeners for application update event. Fires when an application has been updated by hermes-package-updater
 */
  onApplicationUpdated(func: (appMeta) => any) {
    this.applicationUpdatedObservable.subscribe(func);
  }

  /**
   * Register listeners for deployment status update event.
   * Fires when a deployment gets transitioned to status done, will fire for each phase
   */
  onDeploymentStatusUpdate(func: (event: DeploymentStatusEvent) => any) {
    this.deploymentStatusUpdateSObservable.subscribe(func);
  }

  /**
   * Register listeners for hermes package updater connect event.
   * Fires when a new instance of hermes-package-updater connects
   */
  onPackagerConnected(func: () => any) {
    this.packageUpdaterConnectedObservable.subscribe(func);
  }

  addDeploymentMetaInfo(deployment: Deployment) {
    const meta = {
      $isEditable: false,
      $isInstallable: false
    };

    deployment.$meta = meta;

    // pull requests and release candidate should always be installable/promotable
    meta.$isInstallable = true;

    if (!deployment.pullRequestMeta) {
      return;
    }

    let prStatus = deployment.pullRequestMeta.status;

    let isStatusEditable = ![PullRequestStatus.MERGING_BLOCKED, PullRequestStatus.PENDING_REVIEW].includes(prStatus);

    for (const prop in deployment) {
      if (prop === DeploymentField.Status && isStatusEditable) {
        meta[prop] = {
          isEditable: true
        };
        meta.$isEditable = true;
      } else {
        meta[prop] = {
          isEditable: false
        };
      }
    }
  }

  updateDeployment(deploymentId, deployment: {pullId: string, jiraStatusId: string}) {
    return this.clientInstance.apis.deployments.updateDeployment({
      deploymentId,
      deployment
    });
  }

  signalDeploymentInstall(options: {deploymentName: string, pullId: string, stageIdentifier: string}) {
    return this.clientInstance.apis.deployments.signalDeploymentInstall({
      deploymentName: options.deploymentName,
      pullId: options.pullId,
      payload: {
        stageIdentifier: options.stageIdentifier
      }
    });
  }

  promoteDeployment(options: {deploymentName: string, version: string, serverTag: string}) {
    return this.clientInstance.apis.deployments.promoteDeployment(options);
  }

  getPullRequestDeploymentContext(band: DeploymentBand): DeploymentContext {
    return this.clientInstance.apis.deployments.getPullRequestDeploymentContext({
      band
    });
  }

  getServerDeploymentMeta(band?: DeploymentBand): Promise<ServerDeployment[]> {
    return this.clientInstance.apis.deployments.getServerDeploymentMeta({
      band
    });
  }

  resetDeploymentToRelease(deploymentName, serverTag) {
    return this.clientInstance.apis.deployments.resetDeploymentToRelease({
      deploymentName,
      serverTag
    });
  }
}
