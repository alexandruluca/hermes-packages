import {Deployment} from 'src/app/common/models/domain/Deployment';

export enum ColumnMode {
  RELEASE_CANDIDATE = 'release-candidate',
  PULL_REQUEST = 'pull-request'
}

const SharedColumn = {
  NAME: {
    field: 'name', header: 'Name', isEditable: false, isSortable: true
  },
  VERSION: {
    field: 'version', header: 'Version', isEditable: false, renderer: (row: Deployment) => {
      return `<a target="_blank" href="${row.downloadLink}">${row.version}</a>`;
    }
  },
};

export class ColumnFactory {
  static getColumns(mode: ColumnMode) {
    if (mode === ColumnMode.PULL_REQUEST) {
      return this.getPullRequestColumns();
    }
    return this.getReleaseCandidateColumns();
  }

  private static getReleaseCandidateColumns() {
    return [
      SharedColumn.NAME,
      SharedColumn.VERSION,
      {field: 'serverTags', header: 'Servers', isEditable: false}
    ];
  }

  private static getPullRequestColumns() {
    return [
      SharedColumn.NAME,
      SharedColumn.VERSION,
      {
        field: 'pullRequestMeta.jiraLink', header: 'Jira number', isEditable: false, renderer(row: Deployment) {
          if (!row.pullRequestMeta) {
            return '';
          }
          return `<a target="_blank" href="${row.pullRequestMeta.jiraLink}">${row.pullRequestMeta.issueNumber}</a>`;
        }
      },
      {field: 'jiraStatus.name', header: 'Jira status', isEditable: true},
      {field: 'pullRequestMeta.status', header: 'Pull request status', isEditable: false},
      {
        field: 'pullRequestMeta.pullLink', header: 'Description', isEditable: false, renderer(row: Deployment) {
          if (!row.pullRequestMeta) {
            return '';
          }
          return `<a target="_blank" href="${row.pullRequestMeta.pullLink}">${row.pullRequestMeta.pullTitle}</a>`;
        }
      }
    ];
  }
}
