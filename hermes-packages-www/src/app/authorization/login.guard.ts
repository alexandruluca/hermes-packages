import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {CanActivate} from '@angular/router/src/utils/preactivation';
import {UserService} from './user.service';
import {Config} from '../common/config.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  public path: ActivatedRouteSnapshot[];
  public route: ActivatedRouteSnapshot;

  constructor(private userService: UserService, private config: Config) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let session = await this.userService.getUserSession();

    return false;
   /*  if (!session.user) {
      window.location.href = `${this.config.locationOrigin}/authorize`;
      return false;
    }

    return true; */
  }
}
