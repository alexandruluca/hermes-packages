export enum DeploymentBand {
  DEVELOP = 'develop',
  RELEASE = 'release',
  PRODUCTION = 'production',
  QA = 'qa'
}

export interface Stage {
  type: 'on-premise' | 'aws';
  band: 'qa' | 'production';
  regions: string[],
  resourceName?: string,
  resourceType?: string,
  runtime?: 'nodejs'
}

export enum DeploymentStatus {
  DONE = 'Done',
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  IN_REVIEW = 'In Review',
  IN_QA = 'In QA',
  MERGING_BLOCKED = 'Merging blocked'
}

export interface Deployment {
  id: string;
  version: string;
  name: string;
  band: DeploymentBand;
  serverTag?: string;
  jiraStatus: {id: string, name: DeploymentStatus};
  isHotfix?: boolean;
  iosCfBundleId?: string;
  androidVersionCode?: string;
  pullRequestMeta?: PullRequestMeta;
  isMobileApplicationDeployment?: boolean;
  downloadLink?: string;
  transitionList?: {id: string, name: string}[];
  isMergingBlocked?: boolean;
  createdAt: string;
  updatedAt: string;
  $meta: object;
}

export interface Project {
  name: string;
  stages: ProjectStage[];
  $meta?: object;
}

export interface ProjectStage {
  band: string;
  type: 'on-premise' | 'aws';
  resourceType?: string;
  resourceName?: string;
  regions?: string[];
  runtime?: string;

}

export enum DeploymentField {
  Name = 'name',
  Review = 'review',
  Status = 'jiraStatus',
  IsPullRequest = 'isPullRequest'
}

export enum PullRequestStatus {
  PENDING_REVIEW = 'pending_review',
  MERGING_BLOCKED = 'merging-blocked',
  MERGED = 'merged'
}

export interface PullRequestMeta {
  status: PullRequestStatus;
  actualCommit: string;
  actualCommitAuthor: string;
  actualCommitAuthorEmail: string;
  pullDescription: string;
  pullId: string;
  pullLink: string;
  jiraLink: string;
  pullTitle: string;
  sourceBranch: string;
  targetBranch: string;
  sha1: string;
  issueNumber: string;
}

export interface DeploymentStatusEvent {
  eventName: string;
  action: 'start' | 'end';
  issueNumber: string;
  pullId: string;
  sourceBranch: string;
  targetBranch: string;
}
