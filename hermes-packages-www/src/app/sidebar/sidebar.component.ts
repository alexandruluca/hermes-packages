import { Component, OnInit } from '@angular/core';
import {UserService} from '../authorization/user.service';
import {UserProfile} from '../common/models/domain/UserProfile';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private router: Router;
  public userProfile: UserProfile;
  public userService: UserService;

  constructor(userService: UserService, router: Router) {
    this.userService = userService;
    this.router = router;

    this.userProfile = this.userService.getUserProfile();
  }

  ngOnInit() {
  }

  public doRoute(route: string) {
    this.router.navigate([route]);
  }

}
