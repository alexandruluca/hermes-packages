import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {CanActivate} from '@angular/router/src/utils/preactivation';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  private userService: UserService;
  private router: Router;
  public path: ActivatedRouteSnapshot[];
  public route: ActivatedRouteSnapshot;

  constructor(userService: UserService, router: Router) {
    this.userService = userService;
    this.router = router;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.userService.isUserLoggedIn()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
