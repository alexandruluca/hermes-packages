import {DeploymentBand} from './Deployment';

export interface DeploymentContext {
  connectedServers: {tag: string, band: DeploymentBand}[];
  deploymentNames: string[];
  projectKeys: string[];
}
