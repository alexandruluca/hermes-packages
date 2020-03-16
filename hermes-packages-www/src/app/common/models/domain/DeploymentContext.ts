import {DeploymentBand} from './Deployment';

export interface DeploymentContext {
  connectedServers: {tag: string, band: DeploymentBand, deploymentMeta: {version: string, deploymentName: string}[]}[];
  deploymentNames: string[];
  projectKeys: string[];
}
