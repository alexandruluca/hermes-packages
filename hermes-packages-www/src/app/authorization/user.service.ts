import {Injectable, NgZone} from '@angular/core';
import {Api} from '../common/api.service';
import {LocalStorageService} from '../local-storage.service';
import {Router} from '@angular/router';
import {Config} from '../common/config.service';
import {UserProfile} from '../common/models/domain/UserProfile';
import {HttpClient} from '@angular/common/http';
import {resolve} from 'url';

const Keys = {
  USER_LOGGED_IN_KEY: 'isUserLoggedIn',
  TOKEN_EXPIRES_AT: 'tokenExpiresAt',
  ACCESS_TOKEN: 'accessToken',
  USER_PROFILE: 'userProfile'
};

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api: Api;
  private localStorageService: LocalStorageService;
  private router: Router;
  private zone: NgZone;
  private config: Config;
  private http: HttpClient;

  constructor(api: Api, config: Config, localStorageService: LocalStorageService, router: Router, zone: NgZone, http: HttpClient) {
    this.api = api;
    this.config = config;
    this.localStorageService = localStorageService;
    this.zone = zone;
    this.router = router;
    this.http = http;
    this.api.setRequestInterceptor(this.getRequestInterceptor());
    this.api.setResponseInterceptor(this.getResponseInterceptor());
  }

  private initAuth2() {
    return new Promise((resolve, reject) => {
      return gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: this.config.githubApiClientId,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email',
          access_type: 'offline',
          prompt: 'consent select_account',
          hosted_domain: 'hermes.com'
        });

        resolve();
      });
    });
  }

  public reanderLoginButton({redirectOnLogin}) {
    return this.initAuth2().then(() => {
      return gapi.signin2.render('googleBtn', {
        scope: 'profile email',
        width: 240,
        height: 50,
        longtitle: true,
        theme: 'dark',
        onsuccess: (googleUser) => {
          this.handleLogin(googleUser, redirectOnLogin);
        }
      });
    });
  }

  private handleLogin(googleUser, redirectOnLogin) {
    this.zone.run(() => {
      if (!this.isUserLoggedIn()) {
        this.localStorageService.setItem(Keys.USER_LOGGED_IN_KEY, true);
      }

      this.setCurrentCredentials();

      this.router.navigate([redirectOnLogin]);
    });
  }

  /**
   * Check if the current token is about to expire
   */
  private isExpiringAccessToken(): boolean {
    const tokenExpireTime = this.localStorageService.getItem(Keys.TOKEN_EXPIRES_AT);

    if (new Date().getTime() < (tokenExpireTime + 20)) {
      return false;
    }

    return true;
  }

  /**
   * If required, will refresh the access token
   */
  private async refreshAccessToken() {
    await this.initAuth2();

    return gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse().then(() => {
      const {accessToken} = this.setCurrentCredentials();
      this.localStorageService.setItem(Keys.ACCESS_TOKEN, accessToken);
      return accessToken;
    });
  }

  private setCurrentCredentials() {
    const currentUser = gapi.auth2.getAuthInstance().currentUser.get();
    const profile = currentUser.getBasicProfile();
    const userEmail = profile.getEmail();

    const authRes = currentUser.getAuthResponse();
    const accessToken = authRes.id_token;

    this.localStorageService.setItem(Keys.ACCESS_TOKEN, accessToken);
    this.localStorageService.setItem(Keys.TOKEN_EXPIRES_AT, authRes.expires_at);
    this.localStorageService.setItem(Keys.USER_PROFILE, {
      email: userEmail,
      firstName: profile.getGivenName(),
      lastName: profile.getFamilyName(),
      imageUrl: profile.getImageUrl()
    });

    return {
      userEmail,
      accessToken
    };
  }

  getUserProfile(): UserProfile {
    return this.localStorageService.getItem(Keys.USER_PROFILE);
  }

  /*   public loginUser(userEmail: string, {accessToken, expiresAt}: {accessToken: string, expiresAt: number}) {
      return this.api.userApi.login(userEmail, accessToken).then(() => {
        this.localStorageService.setItem(USER_LOGGED_IN_KEY, true);
        this.localStorageService.setItem(TOKEN_EXPIRES_AT, expiresAt);
      });
    } */

  isUserLoggedIn(): boolean {
    return true;
    return this.localStorageService.getItem(Keys.USER_LOGGED_IN_KEY) as boolean;
  }

  private getAccessToken() {
    return this.localStorageService.getItem('accessToken');
  }

  async getUserSession(): Promise<{user?: object}> {
    let session: {user?: object} = await this.api.userApi.getSession();

    if (session.user) {
      this.localStorageService.setItem(Keys.USER_PROFILE, session.user)
    }

    return session;
  }

  private getRequestInterceptor() {
    return async (req) => {
      let accessToken = this.getAccessToken();

      if (accessToken) {
        if (this.isExpiringAccessToken()) {
          accessToken = await this.refreshAccessToken();
        }

        req.headers['access-token'] = accessToken;
      }

      return req;
    };
  }

  private getResponseInterceptor() {
    return (res) => {
      const accessToken = res.headers['access-token'];

      if (accessToken) {
        this.localStorageService.setItem('accessToken', accessToken);
      }

      return res;
    };
  }
}
