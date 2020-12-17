import {PullRequestMeta} from '../common/models/domain/Deployment';

export function formatDeploymentVersion(version, pullRequestMeta: PullRequestMeta) {
  if (pullRequestMeta) {
    return `${version}-prid-${pullRequestMeta.pullId}/${pullRequestMeta.issueNumber} - ${pullRequestMeta.sourceBranch}`;
  }
  return version;
}
