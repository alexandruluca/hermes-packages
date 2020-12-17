import {Deployment} from '../domain/Deployment';
import {SelectItem} from 'primeng/components/common/selectitem';

export interface PresentationDeployment extends Deployment {
  presentationTransitionList: SelectItem[];
}

export abstract class DeploymentMapper {
  static toPresentationDeploymentList(deployments: Deployment[]): PresentationDeployment[] {
    return deployments.map(this.toPresentationDeployment);
  }

  static toPresentationDeployment(deployment: Deployment): PresentationDeployment {
    deployment = JSON.parse(JSON.stringify(deployment));
    const presentationDeployment = Object.assign({}, deployment) as PresentationDeployment;

    if (presentationDeployment.transitionList) {
      presentationDeployment.presentationTransitionList = [];

      presentationDeployment.transitionList.forEach(transition => {
        presentationDeployment.presentationTransitionList.push({value: transition.id, label: transition.name});
      });
    }

    return presentationDeployment;
  }
}
