import {DeploymentBand, Stage} from './Deployment';

export interface DeploymentContext {
  connectedServers: {
    tag: string,
    band: DeploymentBand,
    deploymentMeta: {version: string, deploymentName: string}[],
    stage?: Stage
  }[];
  deploymentNames: string[];
  projectKeys: string[];
}
