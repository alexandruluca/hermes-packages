import {PullRequestMeta, DeploymentBand} from './Deployment';

export interface ServerDeployment {
  deploymentName: string;
  serverTag: string;
  band: DeploymentBand;
  version: string;
  pullRequestMeta: PullRequestMeta;
}
