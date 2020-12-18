import {DeploymentBand, Stage} from './Deployment';

export interface DeploymentContext {
  connectedServers: {
    tag: string,
    band: DeploymentBand,
    deploymentName: string;
    deploymentMeta: {version: string, deploymentName: string}[],
    stage?: Stage
  }[];
  deploymentNames: string[];
  projectKeys: string[];
}
