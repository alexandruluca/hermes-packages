import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from './authorization/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hermes-packages-web';
  sideBarVisible = true;
  public userService: UserService;

  constructor(public translate: TranslateService, userService: UserService) {
    this.userService = userService;
    translate.addLangs(['en']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
}
