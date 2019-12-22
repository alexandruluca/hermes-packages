import {Component, OnInit, AfterViewInit, NgZone} from '@angular/core';
import {UserService} from '../user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  private userService: UserService;
  private redirectOnLogin: string;
  private router: Router;
  private  zone: NgZone;

  constructor(userService: UserService, route: ActivatedRoute, router: Router, zone: NgZone) {
    this.userService = userService;
    this.redirectOnLogin = route.snapshot.data.redirectOnLogin;
    this.router = router;
    this.zone = zone;
  }

  ngAfterViewInit() {
    this.userService.reanderLoginButton({
      redirectOnLogin: this.redirectOnLogin
    });
  }
}
