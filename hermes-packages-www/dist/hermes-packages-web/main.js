(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<app-sidebar *ngIf=\"userService.isUserLoggedIn()\">\n  <router-outlet></router-outlet>\n</app-sidebar>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _authorization_user_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./authorization/user.service */ "./src/app/authorization/user.service.ts");




var AppComponent = /** @class */ (function () {
    function AppComponent(translate, userService) {
        this.translate = translate;
        this.title = 'hermes-packages-web';
        this.sideBarVisible = true;
        this.userService = userService;
        translate.addLangs(['en']);
        translate.setDefaultLang('en');
        var browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    }
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__["TranslateService"], _authorization_user_service__WEBPACK_IMPORTED_MODULE_3__["UserService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: initializeApp, HttpLoaderFactory, AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeApp", function() { return initializeApp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpLoaderFactory", function() { return HttpLoaderFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _authorization_authentication_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./authorization/authentication.module */ "./src/app/authorization/authentication.module.ts");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _common_api_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./common/api.service */ "./src/app/common/api.service.ts");
/* harmony import */ var _deployment_deployment_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./deployment/deployment.module */ "./src/app/deployment/deployment.module.ts");
/* harmony import */ var _deployment_deployment_list_deployment_list_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./deployment/deployment-list/deployment-list.component */ "./src/app/deployment/deployment-list/deployment-list.component.ts");
/* harmony import */ var _authorization_login_guard__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./authorization/login.guard */ "./src/app/authorization/login.guard.ts");
/* harmony import */ var _server_state_server_state_list_server_state_list_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./server-state/server-state-list/server-state-list.component */ "./src/app/server-state/server-state-list/server-state-list.component.ts");
/* harmony import */ var _server_state_server_state_module__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./server-state/server-state.module */ "./src/app/server-state/server-state.module.ts");
/* harmony import */ var _overview_overview_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./overview/overview.component */ "./src/app/overview/overview.component.ts");
/* harmony import */ var _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./sidebar/sidebar.component */ "./src/app/sidebar/sidebar.component.ts");
/* harmony import */ var _deployment_deployment_list_deployment_list_pr_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./deployment/deployment-list/deployment-list-pr.component */ "./src/app/deployment/deployment-list/deployment-list-pr.component.ts");
/* harmony import */ var _deployment_deployment_list_deployment_list_rc_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./deployment/deployment-list/deployment-list-rc.component */ "./src/app/deployment/deployment-list/deployment-list-rc.component.ts");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @ngx-translate/http-loader */ "./node_modules/@ngx-translate/http-loader/fesm5/ngx-translate-http-loader.js");
/* harmony import */ var _project_project_list_project_list_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./project/project-list/project-list.component */ "./src/app/project/project-list/project-list.component.ts");
/* harmony import */ var _project_project_module__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./project/project.module */ "./src/app/project/project.module.ts");






















function initializeApp(api) {
    return function () {
        return api.initialize();
    };
}
function HttpLoaderFactory(httpClient) {
    return new _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_19__["TranslateHttpLoader"](httpClient);
}
var appRoutes = [
    { path: 'projects', component: _project_project_list_project_list_component__WEBPACK_IMPORTED_MODULE_20__["ProjectListComponent"], canActivate: [_authorization_login_guard__WEBPACK_IMPORTED_MODULE_11__["LoginGuard"]] },
    { path: 'deployments/pull-request', component: _deployment_deployment_list_deployment_list_pr_component__WEBPACK_IMPORTED_MODULE_16__["DeploymentListPullRequestComponent"], canActivate: [_authorization_login_guard__WEBPACK_IMPORTED_MODULE_11__["LoginGuard"]] },
    { path: 'deployments/release-candidate', component: _deployment_deployment_list_deployment_list_rc_component__WEBPACK_IMPORTED_MODULE_17__["DeploymentListReleaseCandidateComponent"], canActivate: [_authorization_login_guard__WEBPACK_IMPORTED_MODULE_11__["LoginGuard"]] },
    { path: 'deployments/:deploymentType', component: _deployment_deployment_list_deployment_list_component__WEBPACK_IMPORTED_MODULE_10__["DeploymentListComponent"], canActivate: [_authorization_login_guard__WEBPACK_IMPORTED_MODULE_11__["LoginGuard"]] },
    { path: 'servers', component: _server_state_server_state_list_server_state_list_component__WEBPACK_IMPORTED_MODULE_12__["ServerStateListComponent"], canActivate: [_authorization_login_guard__WEBPACK_IMPORTED_MODULE_11__["LoginGuard"]] },
    { path: 'overview', component: _overview_overview_component__WEBPACK_IMPORTED_MODULE_14__["OverviewComponent"], canActivate: [_authorization_login_guard__WEBPACK_IMPORTED_MODULE_11__["LoginGuard"]] },
    { path: '**', redirectTo: '/deployments/pull-request', canActivate: [_authorization_login_guard__WEBPACK_IMPORTED_MODULE_11__["LoginGuard"]] }
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
                _overview_overview_component__WEBPACK_IMPORTED_MODULE_14__["OverviewComponent"],
                _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_15__["SidebarComponent"]
            ],
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forRoot(appRoutes, { enableTracing: false }),
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClientModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_18__["TranslateModule"].forRoot({
                    loader: {
                        provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_18__["TranslateLoader"],
                        useFactory: HttpLoaderFactory,
                        deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClient"]]
                    }
                }),
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__["BrowserAnimationsModule"],
                /* Custom */
                _authorization_authentication_module__WEBPACK_IMPORTED_MODULE_6__["AuthenticationModule"],
                _deployment_deployment_module__WEBPACK_IMPORTED_MODULE_9__["DeploymentModule"],
                _project_project_module__WEBPACK_IMPORTED_MODULE_21__["ProjectModule"],
                _server_state_server_state_module__WEBPACK_IMPORTED_MODULE_13__["ServerStateModule"]
            ],
            providers: [
                { provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__["APP_INITIALIZER"], useFactory: initializeApp, deps: [_common_api_service__WEBPACK_IMPORTED_MODULE_8__["Api"]], multi: true }
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/authorization/authentication.module.ts":
/*!********************************************************!*\
  !*** ./src/app/authorization/authentication.module.ts ***!
  \********************************************************/
/*! exports provided: AuthenticationModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthenticationModule", function() { return AuthenticationModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");



var AuthenticationModule = /** @class */ (function () {
    function AuthenticationModule() {
    }
    AuthenticationModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [],
            exports: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]
            ]
        })
    ], AuthenticationModule);
    return AuthenticationModule;
}());



/***/ }),

/***/ "./src/app/authorization/login.guard.ts":
/*!**********************************************!*\
  !*** ./src/app/authorization/login.guard.ts ***!
  \**********************************************/
/*! exports provided: LoginGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginGuard", function() { return LoginGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _user_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./user.service */ "./src/app/authorization/user.service.ts");
/* harmony import */ var _common_config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/config.service */ "./src/app/common/config.service.ts");




var LoginGuard = /** @class */ (function () {
    function LoginGuard(userService, config) {
        this.userService = userService;
        this.config = config;
    }
    LoginGuard.prototype.canActivate = function (route, state) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var session;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserSession()];
                    case 1:
                        session = _a.sent();
                        if (!session.user) {
                            window.location.href = this.config.locationOrigin + "/api/authorize";
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    LoginGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_user_service__WEBPACK_IMPORTED_MODULE_2__["UserService"], _common_config_service__WEBPACK_IMPORTED_MODULE_3__["Config"]])
    ], LoginGuard);
    return LoginGuard;
}());



/***/ }),

/***/ "./src/app/authorization/user.service.ts":
/*!***********************************************!*\
  !*** ./src/app/authorization/user.service.ts ***!
  \***********************************************/
/*! exports provided: UserService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserService", function() { return UserService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _common_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/api.service */ "./src/app/common/api.service.ts");
/* harmony import */ var _local_storage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../local-storage.service */ "./src/app/local-storage.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _common_config_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/config.service */ "./src/app/common/config.service.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");







var Keys = {
    USER_LOGGED_IN_KEY: 'isUserLoggedIn',
    TOKEN_EXPIRES_AT: 'tokenExpiresAt',
    ACCESS_TOKEN: 'accessToken',
    USER_PROFILE: 'userProfile'
};
var UserService = /** @class */ (function () {
    function UserService(api, config, localStorageService, router, zone, http) {
        this.api = api;
        this.config = config;
        this.localStorageService = localStorageService;
        this.zone = zone;
        this.router = router;
        this.http = http;
        this.api.setRequestInterceptor(this.getRequestInterceptor());
        this.api.setResponseInterceptor(this.getResponseInterceptor());
    }
    UserService.prototype.initAuth2 = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return gapi.load('auth2', function () {
                gapi.auth2.init({
                    client_id: _this.config.githubApiClientId,
                    cookiepolicy: 'single_host_origin',
                    scope: 'profile email',
                    access_type: 'offline',
                    prompt: 'consent select_account',
                    hosted_domain: 'hermes.com'
                });
                resolve();
            });
        });
    };
    UserService.prototype.reanderLoginButton = function (_a) {
        var _this = this;
        var redirectOnLogin = _a.redirectOnLogin;
        return this.initAuth2().then(function () {
            return gapi.signin2.render('googleBtn', {
                scope: 'profile email',
                width: 240,
                height: 50,
                longtitle: true,
                theme: 'dark',
                onsuccess: function (googleUser) {
                    _this.handleLogin(googleUser, redirectOnLogin);
                }
            });
        });
    };
    UserService.prototype.handleLogin = function (googleUser, redirectOnLogin) {
        var _this = this;
        this.zone.run(function () {
            if (!_this.isUserLoggedIn()) {
                _this.localStorageService.setItem(Keys.USER_LOGGED_IN_KEY, true);
            }
            _this.setCurrentCredentials();
            _this.router.navigate([redirectOnLogin]);
        });
    };
    /**
     * Check if the current token is about to expire
     */
    UserService.prototype.isExpiringAccessToken = function () {
        var tokenExpireTime = this.localStorageService.getItem(Keys.TOKEN_EXPIRES_AT);
        if (new Date().getTime() < (tokenExpireTime + 20)) {
            return false;
        }
        return true;
    };
    /**
     * If required, will refresh the access token
     */
    UserService.prototype.refreshAccessToken = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initAuth2()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse().then(function () {
                                var accessToken = _this.setCurrentCredentials().accessToken;
                                _this.localStorageService.setItem(Keys.ACCESS_TOKEN, accessToken);
                                return accessToken;
                            })];
                }
            });
        });
    };
    UserService.prototype.setCurrentCredentials = function () {
        var currentUser = gapi.auth2.getAuthInstance().currentUser.get();
        var profile = currentUser.getBasicProfile();
        var userEmail = profile.getEmail();
        var authRes = currentUser.getAuthResponse();
        var accessToken = authRes.id_token;
        this.localStorageService.setItem(Keys.ACCESS_TOKEN, accessToken);
        this.localStorageService.setItem(Keys.TOKEN_EXPIRES_AT, authRes.expires_at);
        this.localStorageService.setItem(Keys.USER_PROFILE, {
            email: userEmail,
            firstName: profile.getGivenName(),
            lastName: profile.getFamilyName(),
            imageUrl: profile.getImageUrl()
        });
        return {
            userEmail: userEmail,
            accessToken: accessToken
        };
    };
    UserService.prototype.getUserProfile = function () {
        return this.localStorageService.getItem(Keys.USER_PROFILE);
    };
    /*   public loginUser(userEmail: string, {accessToken, expiresAt}: {accessToken: string, expiresAt: number}) {
        return this.api.userApi.login(userEmail, accessToken).then(() => {
          this.localStorageService.setItem(USER_LOGGED_IN_KEY, true);
          this.localStorageService.setItem(TOKEN_EXPIRES_AT, expiresAt);
        });
      } */
    UserService.prototype.isUserLoggedIn = function () {
        return true;
        return this.localStorageService.getItem(Keys.USER_LOGGED_IN_KEY);
    };
    UserService.prototype.getAccessToken = function () {
        return this.localStorageService.getItem('accessToken');
    };
    UserService.prototype.getUserSession = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var session;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.userApi.getSession()];
                    case 1:
                        session = _a.sent();
                        if (session.user) {
                            this.localStorageService.setItem(Keys.USER_PROFILE, session.user);
                        }
                        return [2 /*return*/, session];
                }
            });
        });
    };
    UserService.prototype.getRequestInterceptor = function () {
        var _this = this;
        return function (req) { return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](_this, void 0, void 0, function () {
            var accessToken;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accessToken = this.getAccessToken();
                        if (!accessToken) return [3 /*break*/, 3];
                        if (!this.isExpiringAccessToken()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.refreshAccessToken()];
                    case 1:
                        accessToken = _a.sent();
                        _a.label = 2;
                    case 2:
                        req.headers['access-token'] = accessToken;
                        _a.label = 3;
                    case 3: return [2 /*return*/, req];
                }
            });
        }); };
    };
    UserService.prototype.getResponseInterceptor = function () {
        var _this = this;
        return function (res) {
            var accessToken = res.headers['access-token'];
            if (accessToken) {
                _this.localStorageService.setItem('accessToken', accessToken);
            }
            return res;
        };
    };
    UserService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_common_api_service__WEBPACK_IMPORTED_MODULE_2__["Api"], _common_config_service__WEBPACK_IMPORTED_MODULE_5__["Config"], _local_storage_service__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"], _angular_common_http__WEBPACK_IMPORTED_MODULE_6__["HttpClient"]])
    ], UserService);
    return UserService;
}());



/***/ }),

/***/ "./src/app/common/api.service.ts":
/*!***************************************!*\
  !*** ./src/app/common/api.service.ts ***!
  \***************************************/
/*! exports provided: Api */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Api", function() { return Api; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var swagger_client_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! swagger-client/browser */ "./node_modules/swagger-client/browser/index.js");
/* harmony import */ var swagger_client_browser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(swagger_client_browser__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _loading_mask_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./loading-mask.service */ "./src/app/common/loading-mask.service.ts");
/* harmony import */ var _config_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config.service */ "./src/app/common/config.service.ts");





swagger_client_browser__WEBPACK_IMPORTED_MODULE_2___default.a.http.withCredentials = true;
var Api = /** @class */ (function () {
    function Api(loadinMaskService, config) {
        var _this = this;
        this.requestInterceptors = [];
        this.responseInterceptors = [];
        this.loadinMaskService = loadinMaskService;
        this.config = config;
        this.requestInterceptors.push(function (req) {
            _this.loadinMaskService.showLoadingMask();
            return req;
        });
        this.responseInterceptors.push(function (res) {
            _this.loadinMaskService.hideLoadingMask();
            if (res.ok === false && res.body && res.body.message) {
                res.statusText = res.body.message;
                return res;
            }
            return res;
        });
    }
    Api.prototype.setRequestInterceptor = function (reqInterceptor) {
        this.requestInterceptors.push(reqInterceptor);
    };
    Api.prototype.setResponseInterceptor = function (resInterceptor) {
        this.responseInterceptors.push(resInterceptor);
    };
    Api.prototype.initialize = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var spec, _a, _loop_1, this_1, apiKey;
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.config.initialize()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, fetch(this.config.apiDocsUrl).then(function (r) { return r.json(); })];
                    case 2:
                        spec = _b.sent();
                        spec.schemes = [
                            location.protocol.startsWith('https') ? 'https' : 'http'
                        ];
                        _a = this;
                        return [4 /*yield*/, swagger_client_browser__WEBPACK_IMPORTED_MODULE_2___default()({
                                url: this.config.apiDocsUrl,
                                spec: spec,
                                requestInterceptor: function (req) {
                                    req.headers['content-type'] = 'application/json';
                                    return _this.requestInterceptors.reduce(function (request, interceptor) {
                                        request = interceptor(request);
                                        return request;
                                    }, req);
                                },
                                responseInterceptor: function (res) {
                                    return _this.responseInterceptors.reduce(function (response, interceptor) {
                                        response = interceptor(response);
                                        return response;
                                    }, res);
                                },
                            })];
                    case 3:
                        _a.clientInstance = _b.sent();
                        _loop_1 = function (apiKey) {
                            var api = this_1.clientInstance.apis[apiKey];
                            var _loop_2 = function (apiMethodKey) {
                                var fn = api[apiMethodKey];
                                api[apiMethodKey] = function () {
                                    return Promise.resolve(fn.apply(api, arguments).then(function (res) {
                                        if (res.obj && res.obj.data) {
                                            return res.obj.data;
                                        }
                                        return res;
                                    }));
                                };
                            };
                            for (var apiMethodKey in api) {
                                _loop_2(apiMethodKey);
                            }
                        };
                        this_1 = this;
                        // override apis and use ZoneAware promise for the result
                        for (apiKey in this.clientInstance.apis) {
                            _loop_1(apiKey);
                        }
                        this.userApi = new UserApi(this.clientInstance);
                        return [2 /*return*/];
                }
            });
        });
    };
    Api = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_loading_mask_service__WEBPACK_IMPORTED_MODULE_3__["LoadingMaskService"], _config_service__WEBPACK_IMPORTED_MODULE_4__["Config"]])
    ], Api);
    return Api;
}());

var UserApi = /** @class */ (function () {
    function UserApi(clientInstance) {
        this.clientInstance = clientInstance;
    }
    UserApi.prototype.login = function (email, accessToken) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                return [2 /*return*/, this.clientInstance.apis.user.login({
                        email: email,
                        accessToken: accessToken,
                        payload: {
                            accessToken: accessToken
                        }
                    })];
            });
        });
    };
    UserApi.prototype.getSession = function () {
        return this.clientInstance.apis.user.getSession();
    };
    return UserApi;
}());


/***/ }),

/***/ "./src/app/common/common.module.ts":
/*!*****************************************!*\
  !*** ./src/app/common/common.module.ts ***!
  \*****************************************/
/*! exports provided: PackageCommonModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PackageCommonModule", function() { return PackageCommonModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _loading_mask_loading_mask_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./loading-mask/loading-mask.component */ "./src/app/common/loading-mask/loading-mask.component.ts");
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/toast */ "./node_modules/primeng/toast.js");
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(primeng_toast__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var primeng_checkbox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/checkbox */ "./node_modules/primeng/checkbox.js");
/* harmony import */ var primeng_checkbox__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(primeng_checkbox__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/button */ "./node_modules/primeng/button.js");
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(primeng_button__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var primeng_table__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/table */ "./node_modules/primeng/table.js");
/* harmony import */ var primeng_table__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(primeng_table__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var primeng_multiselect__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! primeng/multiselect */ "./node_modules/primeng/multiselect.js");
/* harmony import */ var primeng_multiselect__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(primeng_multiselect__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var primeng_dropdown__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/dropdown */ "./node_modules/primeng/dropdown.js");
/* harmony import */ var primeng_dropdown__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(primeng_dropdown__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/inputtext */ "./node_modules/primeng/inputtext.js");
/* harmony import */ var primeng_inputtext__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(primeng_inputtext__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/dialog */ "./node_modules/primeng/dialog.js");
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(primeng_dialog__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var primeng_radiobutton__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! primeng/radiobutton */ "./node_modules/primeng/radiobutton.js");
/* harmony import */ var primeng_radiobutton__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(primeng_radiobutton__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var primeng_chips__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! primeng/chips */ "./node_modules/primeng/chips.js");
/* harmony import */ var primeng_chips__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(primeng_chips__WEBPACK_IMPORTED_MODULE_16__);


















var PackageCommonModule = /** @class */ (function () {
    function PackageCommonModule() {
    }
    PackageCommonModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_loading_mask_loading_mask_component__WEBPACK_IMPORTED_MODULE_4__["LoadingMaskComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]
            ],
            providers: [
                primeng_table__WEBPACK_IMPORTED_MODULE_8__["EditableRow"]
            ],
            exports: [
                _loading_mask_loading_mask_component__WEBPACK_IMPORTED_MODULE_4__["LoadingMaskComponent"],
                primeng_toast__WEBPACK_IMPORTED_MODULE_5__["ToastModule"],
                primeng_checkbox__WEBPACK_IMPORTED_MODULE_6__["CheckboxModule"],
                primeng_button__WEBPACK_IMPORTED_MODULE_7__["ButtonModule"],
                primeng_table__WEBPACK_IMPORTED_MODULE_8__["TableModule"],
                primeng_multiselect__WEBPACK_IMPORTED_MODULE_9__["MultiSelectModule"],
                primeng_dropdown__WEBPACK_IMPORTED_MODULE_10__["DropdownModule"],
                primeng_inputtext__WEBPACK_IMPORTED_MODULE_11__["InputTextModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_12__["FormsModule"],
                primeng_inputtext__WEBPACK_IMPORTED_MODULE_11__["InputTextModule"],
                primeng_dialog__WEBPACK_IMPORTED_MODULE_13__["DialogModule"],
                primeng_radiobutton__WEBPACK_IMPORTED_MODULE_14__["RadioButtonModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_15__["TranslateModule"],
                primeng_chips__WEBPACK_IMPORTED_MODULE_16__["ChipsModule"]
            ]
        })
    ], PackageCommonModule);
    return PackageCommonModule;
}());



/***/ }),

/***/ "./src/app/common/config.service.ts":
/*!******************************************!*\
  !*** ./src/app/common/config.service.ts ***!
  \******************************************/
/*! exports provided: Config */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Config", function() { return Config; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var Config = /** @class */ (function () {
    function Config(http) {
        this.http = http;
        this.locationOrigin = location.origin.includes('localhost') ? 'http://localhost:8090' : location.origin;
        this.apiUrl = this.locationOrigin + "/api";
        this.apiDocsUrl = this.apiUrl + "/api-docs";
    }
    Config.prototype.initialize = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                this.http.get(this.locationOrigin + "/api/config").toPromise().then(function (_a) {
                    var githubApiClientId = _a.githubApiClientId;
                    _this.githubApiClientId = githubApiClientId;
                });
                return [2 /*return*/];
            });
        });
    };
    Config = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], Config);
    return Config;
}());



/***/ }),

/***/ "./src/app/common/loading-mask.service.ts":
/*!************************************************!*\
  !*** ./src/app/common/loading-mask.service.ts ***!
  \************************************************/
/*! exports provided: LoadingMaskService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadingMaskService", function() { return LoadingMaskService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");



var LoadingMaskService = /** @class */ (function () {
    function LoadingMaskService() {
        this.subject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.observable = this.subject.asObservable();
    }
    LoadingMaskService.prototype.onStateChange = function (func) {
        this.observable.subscribe(func);
    };
    LoadingMaskService.prototype.showLoadingMask = function () {
        this.subject.next(true);
    };
    LoadingMaskService.prototype.hideLoadingMask = function () {
        this.subject.next(false);
    };
    LoadingMaskService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], LoadingMaskService);
    return LoadingMaskService;
}());



/***/ }),

/***/ "./src/app/common/loading-mask/loading-mask.component.css":
/*!****************************************************************!*\
  !*** ./src/app/common/loading-mask/loading-mask.component.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbW1vbi9sb2FkaW5nLW1hc2svbG9hZGluZy1tYXNrLmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/common/loading-mask/loading-mask.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/common/loading-mask/loading-mask.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div [hidden]=\"!isVisible\">\n  <div class=\"overlay ng-scope\" test-id=\"loader\">\n    <div class=\"content\">\n      <div class=\"ui text loader active ng-binding\">\n        <div class=\"lds-spinner\">\n          <div></div>\n          <div></div>\n          <div></div>\n          <div></div>\n          <div></div>\n          <div></div>\n          <div></div>\n          <div></div>\n          <div></div>\n          <div></div>\n          <div></div>\n          <div></div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/common/loading-mask/loading-mask.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/common/loading-mask/loading-mask.component.ts ***!
  \***************************************************************/
/*! exports provided: LoadingMaskComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadingMaskComponent", function() { return LoadingMaskComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _loading_mask_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../loading-mask.service */ "./src/app/common/loading-mask.service.ts");



var LoadingMaskComponent = /** @class */ (function () {
    function LoadingMaskComponent(loadingMaskService, zone) {
        var _this = this;
        this.loadingMaskService = loadingMaskService;
        this.zone = zone;
        this.loadingMaskService.onStateChange(function (isVisible) {
            _this.zone.run(function () {
                _this.isVisible = isVisible;
            });
        });
    }
    LoadingMaskComponent.prototype.ngOnInit = function () {
    };
    LoadingMaskComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-loading-mask',
            template: __webpack_require__(/*! ./loading-mask.component.html */ "./src/app/common/loading-mask/loading-mask.component.html"),
            styles: [__webpack_require__(/*! ./loading-mask.component.css */ "./src/app/common/loading-mask/loading-mask.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_loading_mask_service__WEBPACK_IMPORTED_MODULE_2__["LoadingMaskService"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]])
    ], LoadingMaskComponent);
    return LoadingMaskComponent;
}());



/***/ }),

/***/ "./src/app/common/models/domain/Deployment.ts":
/*!****************************************************!*\
  !*** ./src/app/common/models/domain/Deployment.ts ***!
  \****************************************************/
/*! exports provided: DeploymentBand, DeploymentStatus, DeploymentField, PullRequestStatus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentBand", function() { return DeploymentBand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentStatus", function() { return DeploymentStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentField", function() { return DeploymentField; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PullRequestStatus", function() { return PullRequestStatus; });
var DeploymentBand;
(function (DeploymentBand) {
    DeploymentBand["DEVELOP"] = "develop";
    DeploymentBand["RELEASE"] = "release";
    DeploymentBand["PRODUCTION"] = "production";
    DeploymentBand["QA"] = "qa";
})(DeploymentBand || (DeploymentBand = {}));
var DeploymentStatus;
(function (DeploymentStatus) {
    DeploymentStatus["DONE"] = "Done";
    DeploymentStatus["TODO"] = "To Do";
    DeploymentStatus["IN_PROGRESS"] = "In Progress";
    DeploymentStatus["IN_REVIEW"] = "In Review";
    DeploymentStatus["IN_QA"] = "In QA";
    DeploymentStatus["MERGING_BLOCKED"] = "Merging blocked";
})(DeploymentStatus || (DeploymentStatus = {}));
var DeploymentField;
(function (DeploymentField) {
    DeploymentField["Name"] = "name";
    DeploymentField["Review"] = "review";
    DeploymentField["Status"] = "jiraStatus";
    DeploymentField["IsPullRequest"] = "isPullRequest";
})(DeploymentField || (DeploymentField = {}));
var PullRequestStatus;
(function (PullRequestStatus) {
    PullRequestStatus["PENDING_REVIEW"] = "pending_review";
    PullRequestStatus["MERGING_BLOCKED"] = "merging-blocked";
    PullRequestStatus["MERGED"] = "merged";
})(PullRequestStatus || (PullRequestStatus = {}));


/***/ }),

/***/ "./src/app/common/models/presentation/Deployment.ts":
/*!**********************************************************!*\
  !*** ./src/app/common/models/presentation/Deployment.ts ***!
  \**********************************************************/
/*! exports provided: DeploymentMapper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentMapper", function() { return DeploymentMapper; });
var DeploymentMapper = /** @class */ (function () {
    function DeploymentMapper() {
    }
    DeploymentMapper.toPresentationDeploymentList = function (deployments) {
        return deployments.map(this.toPresentationDeployment);
    };
    DeploymentMapper.toPresentationDeployment = function (deployment) {
        deployment = JSON.parse(JSON.stringify(deployment));
        var presentationDeployment = Object.assign({}, deployment);
        if (presentationDeployment.transitionList) {
            presentationDeployment.presentationTransitionList = [];
            presentationDeployment.transitionList.forEach(function (transition) {
                presentationDeployment.presentationTransitionList.push({ value: transition.id, label: transition.name });
            });
        }
        return presentationDeployment;
    };
    return DeploymentMapper;
}());



/***/ }),

/***/ "./src/app/deployment/deployment-list/ColumnFactory.ts":
/*!*************************************************************!*\
  !*** ./src/app/deployment/deployment-list/ColumnFactory.ts ***!
  \*************************************************************/
/*! exports provided: ColumnMode, ColumnFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColumnMode", function() { return ColumnMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColumnFactory", function() { return ColumnFactory; });
var ColumnMode;
(function (ColumnMode) {
    ColumnMode["RELEASE_CANDIDATE"] = "release-candidate";
    ColumnMode["PULL_REQUEST"] = "pull-request";
})(ColumnMode || (ColumnMode = {}));
var SharedColumn = {
    NAME: {
        field: 'name', header: 'Name', isEditable: false, isSortable: true
    },
    VERSION: {
        field: 'version', header: 'Version', isEditable: false, renderer: function (row) {
            return "<a target=\"_blank\" href=\"" + row.downloadLink + "\">" + row.version + "</a>";
        }
    },
};
var ColumnFactory = /** @class */ (function () {
    function ColumnFactory() {
    }
    ColumnFactory.getColumns = function (mode) {
        if (mode === ColumnMode.PULL_REQUEST) {
            return this.getPullRequestColumns();
        }
        return this.getReleaseCandidateColumns();
    };
    ColumnFactory.getReleaseCandidateColumns = function () {
        return [
            SharedColumn.NAME,
            SharedColumn.VERSION,
            { field: 'serverTags', header: 'Servers', isEditable: false }
        ];
    };
    ColumnFactory.getPullRequestColumns = function () {
        return [
            SharedColumn.NAME,
            SharedColumn.VERSION,
            {
                field: 'pullRequestMeta.jiraLink', header: 'Issue number', isEditable: false, renderer: function (row) {
                    if (!row.pullRequestMeta) {
                        return '';
                    }
                    return "<a target=\"_blank\" href=\"" + row.pullRequestMeta.jiraLink + "\">" + row.pullRequestMeta.issueNumber + "</a>";
                }
            },
            { field: 'jiraStatus.name', header: 'Issue status', isEditable: true },
            { field: 'pullRequestMeta.targetBranch', header: 'Target branch', isEditable: false, renderer: function (row) {
                    return "<div class=\"no-wrap\">" + row.pullRequestMeta.targetBranch + " \u2190 " + row.pullRequestMeta.sourceBranch + "</div";
                } },
            { field: 'pullRequestMeta.status', header: 'Pull request status', isEditable: false },
            {
                field: 'pullRequestMeta.pullLink', header: 'Description', isEditable: false, renderer: function (row) {
                    if (!row.pullRequestMeta) {
                        return '';
                    }
                    return "<a target=\"_blank\" href=\"" + row.pullRequestMeta.pullLink + "\">" + row.pullRequestMeta.pullTitle + "</a>";
                }
            }
        ];
    };
    return ColumnFactory;
}());



/***/ }),

/***/ "./src/app/deployment/deployment-list/deployment-list-pr.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/deployment/deployment-list/deployment-list-pr.component.ts ***!
  \****************************************************************************/
/*! exports provided: DeploymentListPullRequestComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentListPullRequestComponent", function() { return DeploymentListPullRequestComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/api */ "./node_modules/primeng/api.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(primeng_api__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _deployment_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deployment-list.component */ "./src/app/deployment/deployment-list/deployment-list.component.ts");
/* harmony import */ var src_app_common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/common/models/domain/Deployment */ "./src/app/common/models/domain/Deployment.ts");





var DeploymentListPullRequestComponent = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](DeploymentListPullRequestComponent, _super);
    function DeploymentListPullRequestComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.deploymentType = _deployment_list_component__WEBPACK_IMPORTED_MODULE_3__["DeploymentType"].PULL_REQUEST;
        _this.isFilteredMode = true;
        _this.installBand = src_app_common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_4__["DeploymentBand"].QA;
        _this.showServerState = true;
        return _this;
    }
    DeploymentListPullRequestComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-pr-deployment-list',
            template: __webpack_require__(/*! ./deployment-list.component.html */ "./src/app/deployment/deployment-list/deployment-list.component.html"),
            providers: [primeng_api__WEBPACK_IMPORTED_MODULE_2__["MessageService"]],
            styles: [__webpack_require__(/*! ./deployment-list.component.scss */ "./src/app/deployment/deployment-list/deployment-list.component.scss")]
        })
    ], DeploymentListPullRequestComponent);
    return DeploymentListPullRequestComponent;
}(_deployment_list_component__WEBPACK_IMPORTED_MODULE_3__["DeploymentListComponent"]));



/***/ }),

/***/ "./src/app/deployment/deployment-list/deployment-list-rc.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/deployment/deployment-list/deployment-list-rc.component.ts ***!
  \****************************************************************************/
/*! exports provided: DeploymentListReleaseCandidateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentListReleaseCandidateComponent", function() { return DeploymentListReleaseCandidateComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/api */ "./node_modules/primeng/api.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(primeng_api__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _deployment_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deployment-list.component */ "./src/app/deployment/deployment-list/deployment-list.component.ts");
/* harmony import */ var src_app_common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/common/models/domain/Deployment */ "./src/app/common/models/domain/Deployment.ts");





var DeploymentListReleaseCandidateComponent = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](DeploymentListReleaseCandidateComponent, _super);
    function DeploymentListReleaseCandidateComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.deploymentType = _deployment_list_component__WEBPACK_IMPORTED_MODULE_3__["DeploymentType"].RELEASE_CANDIDATE;
        _this.isFilteredMode = true;
        _this.installBand = src_app_common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_4__["DeploymentBand"].PRODUCTION;
        return _this;
    }
    DeploymentListReleaseCandidateComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-rc-deployment-list',
            template: __webpack_require__(/*! ./deployment-list.component.html */ "./src/app/deployment/deployment-list/deployment-list.component.html"),
            providers: [primeng_api__WEBPACK_IMPORTED_MODULE_2__["MessageService"]],
            styles: [__webpack_require__(/*! ./deployment-list.component.scss */ "./src/app/deployment/deployment-list/deployment-list.component.scss")]
        })
    ], DeploymentListReleaseCandidateComponent);
    return DeploymentListReleaseCandidateComponent;
}(_deployment_list_component__WEBPACK_IMPORTED_MODULE_3__["DeploymentListComponent"]));



/***/ }),

/***/ "./src/app/deployment/deployment-list/deployment-list.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/deployment/deployment-list/deployment-list.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p-toast [style]=\"{marginTop: '80px'}\"></p-toast>\n\n<p-toast position=\"center\" key=\"c\" [modal]=\"true\" [baseZIndex]=\"5000\">\n  <ng-template let-message pTemplate=\"message\">\n    <div style=\"text-align: center\">\n      <i class=\"pi pi-exclamation-triangle\" style=\"font-size: 3em\"></i>\n      <h3>{{message.summary}}</h3>\n      <p>{{message.detail}}</p>\n    </div>\n    <div class=\"ui-g ui-fluid\">\n      <div class=\"ui-g-6\">\n        <button type=\"button\" pButton label=\"Yes\" class=\"ui-button-success\"></button>\n      </div>\n      <div class=\"ui-g-6\">\n        <button type=\"button\" pButton label=\"No\" class=\"ui-button-secondary\"></button>\n      </div>\n    </div>\n  </ng-template>\n</p-toast>\n\n<p-table #dt [columns]=\"cols\" [value]=\"deployments\" [lazy]=\"true\" (onLazyLoad)=\"loadDeployments($event)\"\n  [tableStyle]=\"{'table-layout':'auto'}\" [totalRecords]=\"totalDeployments\" [loading]=\"loadingDeployments\"\n  [rowsPerPageOptions]=\"[10,20,30]\" [paginator]=\"true\" [rows]=\"10\" dataKey=\"id\" editMode=\"row\">\n  <ng-template pTemplate=\"caption\">\n    <div style=\"text-align: right\" *ngIf=\"!isFilteredMode\">\n      <div class=\"ui-g-12\">\n        <h3 class=\"first\">Deployment type</h3>\n        <p-dropdown [options]=\"deploymentTypes\" (onChange)=\"onPullRequestFilterChanged($event.value)\"></p-dropdown>\n      </div>\n    </div>\n    <div style=\"text-align: right\">\n      <div class=\"ui-g-12\">\n        <h3 class=\"first\">Project</h3>\n        <p-dropdown [options]=\"projectOptions\" (onChange)=\"loadDeploymentsWithFilter('projectKey', $event.value)\">\n        </p-dropdown>\n      </div>\n    </div>\n  </ng-template>\n  <ng-template pTemplate=\"header\" let-columns>\n    <tr>\n      <th *ngFor=\"let col of columns\" [pSortableColumn]=\"col.isSortable && col.field\">\n        {{col.header}}\n        <p-sortIcon [field]=\"col.field\" ariaLabel=\"Activate to sort\" *ngIf=\"col.isSortable\"\n          ariaLabelDesc=\"Activate to sort in descending order\" ariaLabelAsc=\"Activate to sort in ascending order\">\n        </p-sortIcon>\n      </th>\n      <th class=\"edit-column\"></th>\n    </tr>\n    <tr>\n      <th *ngFor=\"let col of columns\" [ngSwitch]=\"col.field\">\n        <div *ngIf=\"deploymentType==='pull-request'\">\n          <p-dropdown *ngSwitchCase=\"'name'\" [options]=\"deploymentNameOptions\" [(ngModel)]=\"selectedProject\" [style]=\"{'width':'100%'}\"\n          (onChange)=\"loadDeploymentsWithFilter(col.field, $event.value)\"></p-dropdown>\n        </div>\n      </th>\n      <th></th>\n    </tr>\n  </ng-template>\n\n\n  <ng-template pTemplate=\"body\" let-rowData let-ri=\"rowIndex\" let-editing=\"editing\">\n    <tr [pEditableRow]=\"rowData\">\n      <td *ngFor=\"let col of cols;\">\n        <div *ngIf=\"col.field !== 'jiraStatus.name'\">\n          <div [innerHTML]=\"getCellValue(rowData, col)\">\n          </div>\n        </div>\n        <p-cellEditor *ngIf=\"col.field === 'jiraStatus.name'\">\n          <ng-template pTemplate=\"input\">\n            <p-dropdown [options]=\"rowData.presentationTransitionList\" [style]=\"{'width':'100%'}\"\n              [(ngModel)]=\"rowData.jiraStatus.id\">\n\n            </p-dropdown>\n          </ng-template>\n          <ng-template pTemplate=\"output\">\n            {{getCellValue(rowData, col)}}\n          </ng-template>\n        </p-cellEditor>\n      </td>\n\n      <td style=\"text-align:center\">\n        <div *ngIf=\"rowData.$meta.$isEditable\" style=\"display: inline-block\">\n          <button *ngIf=\"!editing\" type=\"button\" pInitEditableRow class=\"pi pi-pencil\"\n            (click)=\"editing = true && onRowEditInit(rowData)\"></button>\n          <button *ngIf=\"editing\" type=\"button\" pSaveEditableRow class=\"pi pi-check\" style=\"margin-right: .5em\"\n            (click)=\"onRowEditSave(rowData)\"></button>\n          <button *ngIf=\"editing\" type=\"button\" pCancelEditableRow class=\"pi pi-times\"\n            (click)=\"editing = false && onRowEditCancel(rowData, ri)\"></button>\n        </div>\n        <button *ngIf=\"rowData.$meta.$isInstallable && !editing\" type=\"button\" class=\"pi pi-cloud-upload\"\n          (click)=\"showInstallDeploymentDialog(rowData)\"></button>\n      </td>\n    </tr>\n  </ng-template>\n</p-table>\n\n<app-qa-server-state *ngIf=\"showServerState\"></app-qa-server-state>\n\n<p-dialog *ngIf=\"displayDialog\"\n  header=\"{{installableDeployment?.pullRequestMeta ? 'Install deployment' : 'Promote to production'}}\"\n  [(visible)]=\"displayDialog\" [responsive]=\"true\" showEffect=\"fade\" [modal]=\"true\" [style]=\"{width: '60%'}\">\n  <div class=\"ui-g ui-fluid\" *ngIf=\"installableDeployment\">\n    <div class=\"ui-g-12\">\n      <div class=\"ui-g-4\">\n        <label for=\"serverTag\">Server tag</label>\n      </div>\n      <div class=\"ui-g-8\">\n        <p-dropdown [options]=\"deploymentServerTagOptions\" [(ngModel)]=\"targetInstallServerTag\">\n        </p-dropdown>\n      </div>\n    </div>\n\n    <div *ngIf=\"stage\" style=\"width: 100%;\">\n      <div class=\"ui-g-12\">\n        <div class=\"ui-g-4\">\n          <label>Resource</label>\n        </div>\n        <div class=\"ui-g-8\" *ngIf=\"stage.resourceName\">\n          {{stage.resourceName}} [{{stage.resourceType}}] [{{stage.regions.join(', ')}}]\n        </div>\n      </div>\n    </div>\n\n    <div class=\"ui-g-12\">\n      <div class=\"ui-g-4\">\n        <label for=\"vin\">Name:</label>\n      </div>\n      <div class=\"ui-g-8\">\n        {{installableDeployment.name}}\n      </div>\n    </div>\n    <div class=\"ui-g-12\">\n      <div class=\"ui-g-4\">\n        <label for=\"vin\">Version:</label>\n      </div>\n      <div class=\"ui-g-8\">\n        {{installableDeployment.version}}\n      </div>\n    </div>\n    <div *ngIf=\"installableDeployment.pullRequestMeta\" style=\"width: 100%;\">\n      <div class=\"ui-g-12\">\n        <div class=\"ui-g-4\">\n          <label for=\"vin\">Source branch:</label>\n        </div>\n        <div class=\"ui-g-8\">\n          {{installableDeployment.pullRequestMeta.sourceBranch}}\n        </div>\n      </div>\n      <div class=\"ui-g-12\">\n        <div class=\"ui-g-4\">\n          <label for=\"vin\">Target branch:</label>\n        </div>\n        <div class=\"ui-g-8\">\n          {{installableDeployment.pullRequestMeta.targetBranch}}\n        </div>\n      </div>\n      <div class=\"ui-g-12\">\n        <div class=\"ui-g-4\">\n          <label for=\"vin\">Pull request link:</label>\n        </div>\n        <div class=\"ui-g-8\">\n          {{installableDeployment.pullRequestMeta.pullLink}}\n        </div>\n      </div>\n    </div>\n    <div class=\"ui-g-12\">\n      <app-deployment-progress-indicator></app-deployment-progress-indicator>\n    </div>\n  </div>\n\n  <p-footer>\n    <div class=\"ui-dialog-buttonpane ui-helper-clearfix\">\n      <button type=\"button\" pButton icon=\"pi pi-check\" (click)=\"signalDeploymentInstall()\" [disabled]=\"updateInProgress\"\n        label=\"{{installableDeployment?.pullRequestMeta ? 'Install' : 'Promote'}}\">\n      </button>\n      <button type=\"button\" pButton icon=\"pi\" (click)=\"closeDialog()\" [disabled]=\"updateInProgress\"\n        label=\"{{updateInitialized ? 'OK' :'Cancel'}}\">\n      </button>\n    </div>\n  </p-footer>\n</p-dialog>\n\n<app-deployment-progress-indicator-dialog [deployment]=\"doneTransitionedDeployment\"\n  (closed)=\"onProgressIndicatorClosed()\">\n\n</app-deployment-progress-indicator-dialog>\n\n<app-loading-mask></app-loading-mask>\n"

/***/ }),

/***/ "./src/app/deployment/deployment-list/deployment-list.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/deployment/deployment-list/deployment-list.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".edit-column {\n  width: 8em; }\n\n.ui-g-4, .ui-g-12 {\n  padding: .3em; }\n\n.ui-g-8 {\n  padding: 0; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sdWNhYWxleGFuZHJ1L3dvcmtzcGFjZS90ZXJyaWEvaGVybWVzLXBhY2thZ2VzL2hlcm1lcy1wYWNrYWdlcy13d3cvc3JjL2FwcC9kZXBsb3ltZW50L2RlcGxveW1lbnQtbGlzdC9kZXBsb3ltZW50LWxpc3QuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxVQUFVLEVBQUE7O0FBR1o7RUFDRSxhQUFhLEVBQUE7O0FBR2Y7RUFDRSxVQUFVLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9kZXBsb3ltZW50L2RlcGxveW1lbnQtbGlzdC9kZXBsb3ltZW50LWxpc3QuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZWRpdC1jb2x1bW4ge1xuICB3aWR0aDogOGVtO1xufVxuXG4udWktZy00LCAudWktZy0xMiB7XG4gIHBhZGRpbmc6IC4zZW07XG59XG5cbi51aS1nLTgge1xuICBwYWRkaW5nOiAwO1xufVxuIl19 */"

/***/ }),

/***/ "./src/app/deployment/deployment-list/deployment-list.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/deployment/deployment-list/deployment-list.component.ts ***!
  \*************************************************************************/
/*! exports provided: DeploymentType, DeploymentListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentType", function() { return DeploymentType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentListComponent", function() { return DeploymentListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _deployment_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../deployment.service */ "./src/app/deployment/deployment.service.ts");
/* harmony import */ var _common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common/models/domain/Deployment */ "./src/app/common/models/domain/Deployment.ts");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/api */ "./node_modules/primeng/api.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(primeng_api__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _ColumnFactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ColumnFactory */ "./src/app/deployment/deployment-list/ColumnFactory.ts");
/* harmony import */ var src_app_common_models_presentation_Deployment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/common/models/presentation/Deployment */ "./src/app/common/models/presentation/Deployment.ts");







var DeploymentType;
(function (DeploymentType) {
    DeploymentType["PULL_REQUEST"] = "pull-request";
    DeploymentType["RELEASE_CANDIDATE"] = "release-candidate";
    DeploymentType["ALL"] = "";
})(DeploymentType || (DeploymentType = {}));
var DeploymentListComponent = /** @class */ (function () {
    function DeploymentListComponent(deploymentService, messageService) {
        this.loadingDeployments = true;
        this.updateInProgress = false;
        this.updateInitialized = false;
        this.deploymentTypes = [
            { label: 'PULL REQUEST', value: DeploymentType.PULL_REQUEST },
            { label: 'RELEASE CANDIDATE', value: DeploymentType.RELEASE_CANDIDATE }
        ];
        this.deploymentBand = [
            { label: 'ALL', value: '' },
            { label: 'DEVELOP', value: 'develop' },
            { label: 'RELEASE', value: 'release' },
            { label: 'PRODUCTION', value: 'production' },
        ];
        this.paginationOptions = { query: {} };
        this.deploymentService = deploymentService;
        this.messageService = messageService;
    }
    DeploymentListComponent.prototype.ngOnInit = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setColumnConfig(this.deploymentType);
                        return [4 /*yield*/, this.initializeContext()];
                    case 1:
                        _a.sent();
                        this.deploymentService.onPackagerConnected(function () { return _this.initializeContext(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    DeploymentListComponent.prototype.initializeContext = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var deploymentContext, _a;
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.installBand) {
                            throw new Error('missing install band');
                        }
                        _a = this;
                        return [4 /*yield*/, this.deploymentService.getPullRequestDeploymentContext(this.installBand)];
                    case 1:
                        deploymentContext = _a.deploymentContext = _b.sent();
                        this.targetInstallServerTag = deploymentContext.connectedServers[0] && deploymentContext.connectedServers[0].tag;
                        this.projectOptions = deploymentContext.projectKeys.reduce(function (options, projectKey) {
                            options.push({
                                value: projectKey,
                                label: projectKey
                            });
                            return options;
                        }, [{
                                label: 'ALL',
                                value: undefined
                            }]);
                        this.deploymentNameOptions = deploymentContext.deploymentNames.reduce(function (options, deploymentName) {
                            options.push({ label: deploymentName, value: deploymentName });
                            return options;
                        }, []);
                        if (this.deploymentType === DeploymentType.PULL_REQUEST) {
                            this.selectedProject = this.deploymentNameOptions[0] && this.deploymentNameOptions[0].value;
                            if (this.selectedProject) {
                                this.loadDeploymentsWithFilter('name', this.selectedProject);
                            }
                        }
                        this.deploymentService.onApplicationUpdated(function (_a) {
                            var serverTag = _a.serverTag, deploymentName = _a.deploymentName, version = _a.version;
                            _this.messageService.add({
                                severity: 'info',
                                summary: serverTag + " update",
                                detail: "application " + deploymentName + " has been updated to version " + version
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    DeploymentListComponent.prototype.loadDeployments = function (_a) {
        var first = _a.first, rows = _a.rows, sortField = _a.sortField, sortOrder = _a.sortOrder;
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var queryObj, isPullRequestDeployment, isReleaseCandidate, query, pageNumber, pageResult;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Object.assign(this.paginationOptions, {
                            first: first,
                            rows: rows,
                            sortField: sortField,
                            sortOrder: sortOrder
                        });
                        queryObj = this.paginationOptions.query || {};
                        if (!queryObj.hasOwnProperty('name') && this.deploymentType === DeploymentType.PULL_REQUEST) {
                            console.info('no project name was qiven for query');
                            return [2 /*return*/];
                        }
                        this.loadingDeployments = true;
                        isPullRequestDeployment = this.deploymentType === DeploymentType.PULL_REQUEST;
                        isReleaseCandidate = this.deploymentType === DeploymentType.RELEASE_CANDIDATE;
                        query = {
                            band: isPullRequestDeployment ? _common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_3__["DeploymentBand"].QA : _common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_3__["DeploymentBand"].RELEASE,
                            pullRequestMeta: {
                                $exists: isPullRequestDeployment ? true : false
                            }
                        };
                        if (isPullRequestDeployment) {
                            query['pullRequestMeta.status'] = { $ne: _common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_3__["PullRequestStatus"].MERGED };
                        }
                        Object.assign(query, this.paginationOptions.query);
                        pageNumber = (first / rows) + 1;
                        return [4 /*yield*/, this.deploymentService.getDeployments({
                                query: query,
                                pageNumber: pageNumber,
                                pageSize: rows,
                                sort: {
                                    property: sortField,
                                    direction: sortOrder === 1 ? 'asc' : 'desc'
                                },
                                distinct: isReleaseCandidate ? 'name' : undefined
                            })];
                    case 1:
                        pageResult = _b.sent();
                        this.deployments = src_app_common_models_presentation_Deployment__WEBPACK_IMPORTED_MODULE_6__["DeploymentMapper"].toPresentationDeploymentList(pageResult.items);
                        this.totalDeployments = pageResult.totalCount;
                        this.loadingDeployments = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    DeploymentListComponent.prototype.loadDeploymentsWithFilter = function (property, value, type) {
        if (type === void 0) { type = 'equals'; }
        var _a;
        var operator;
        if (type === 'equals') {
            operator = '$eq';
        }
        if (value || typeof value === 'boolean') {
            this.paginationOptions.query[property] = (_a = {}, _a[operator] = value, _a);
        }
        else {
            delete this.paginationOptions.query[property];
        }
        this.loadDeployments(this.paginationOptions);
    };
    DeploymentListComponent.prototype.refreshPage = function () {
        this.loadDeployments(this.paginationOptions);
    };
    DeploymentListComponent.prototype.onRowEditInit = function (deployment) {
        /*  this.messageService.add({severity: 'info', summary: 'on edit init', detail: 'on edit init'}); */
    };
    DeploymentListComponent.prototype.onRowEditSave = function (deployment) {
        var _this = this;
        var status = deployment.transitionList.find(function (d) { return d.id === deployment.jiraStatus.id; });
        var updatePayload = {
            pullId: deployment.pullRequestMeta.pullId,
            jiraStatusId: deployment.jiraStatus.id
        };
        if (status.name === _common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_3__["DeploymentStatus"].DONE) {
            this.doneTransitionedDeployment = deployment;
        }
        this.deploymentService.updateDeployment(deployment.id, updatePayload).then(function () {
            _this.messageService.add({ severity: 'info', summary: 'was saved', detail: 'save' });
            return _this.refreshPage();
        }).catch(function (err) {
            _this.messageService.add({ severity: 'error', summary: err.message, detail: err.message });
        });
    };
    DeploymentListComponent.prototype.onProgressIndicatorClosed = function () {
        this.doneTransitionedDeployment = null;
    };
    DeploymentListComponent.prototype.onRowEditCancel = function (deployment, index) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Car is updated' });
    };
    DeploymentListComponent.prototype.setColumnConfig = function (deploymentType) {
        if (deploymentType === void 0) { deploymentType = DeploymentType.PULL_REQUEST; }
        var columnMode = deploymentType === DeploymentType.PULL_REQUEST ? _ColumnFactory__WEBPACK_IMPORTED_MODULE_5__["ColumnMode"].PULL_REQUEST : _ColumnFactory__WEBPACK_IMPORTED_MODULE_5__["ColumnMode"].RELEASE_CANDIDATE;
        this.cols = _ColumnFactory__WEBPACK_IMPORTED_MODULE_5__["ColumnFactory"].getColumns(columnMode);
    };
    DeploymentListComponent.prototype.showInstallDeploymentDialog = function (deployment) {
        var _this = this;
        this.displayDialog = true;
        this.installableDeployment = deployment;
        var servers = this.deploymentContext.connectedServers.filter(function (server) {
            return server.band === _this.installBand && server.deploymentName === deployment.name;
        });
        this.deploymentServerTagOptions = servers.reduce(function (tags, server) {
            tags.push({
                value: server.tag,
                label: server.tag,
                stage: server.stage
            });
            return tags;
        }, []);
        if (this.deploymentServerTagOptions[0]) {
            this.targetInstallServerTag = this.deploymentServerTagOptions[0].value;
        }
    };
    Object.defineProperty(DeploymentListComponent.prototype, "stage", {
        get: function () {
            var _this = this;
            if (!this.deploymentServerTagOptions) {
                return;
            }
            var server = this.deploymentServerTagOptions.find(function (s) {
                return s.value === _this.targetInstallServerTag;
            });
            return server && server.stage;
        },
        enumerable: true,
        configurable: true
    });
    DeploymentListComponent.prototype.closeDialog = function () {
        this.displayDialog = false;
        this.updateInitialized = false;
    };
    DeploymentListComponent.prototype.signalDeploymentInstall = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var isPullRequest, err_1;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isPullRequest = this.installableDeployment.pullRequestMeta;
                        this.updateInProgress = true;
                        this.updateInitialized = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        if (!isPullRequest) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.deploymentService.signalDeploymentInstall({
                                deploymentName: this.installableDeployment.name,
                                pullId: this.installableDeployment.pullRequestMeta.pullId,
                                stageIdentifier: this.targetInstallServerTag
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.deploymentService.promoteDeployment({
                            deploymentName: this.installableDeployment.name,
                            version: this.installableDeployment.version,
                            serverTag: this.targetInstallServerTag
                        })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        err_1 = _a.sent();
                        this.messageService.add({ severity: 'error', summary: err_1.message, detail: err_1.message });
                        return [3 /*break*/, 8];
                    case 7:
                        this.updateInProgress = false;
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    DeploymentListComponent.prototype.getCellValue = function (rowData, _a) {
        var field = _a.field, renderer = _a.renderer;
        var dataIndexes = field.split('.');
        var val = rowData;
        for (var i = 0; i < dataIndexes.length; i++) {
            var dataIndex = dataIndexes[i];
            val = val[dataIndex];
            if (!val || typeof val !== 'object') {
                break;
            }
        }
        if (renderer) {
            val = renderer(rowData);
        }
        return val;
    };
    DeploymentListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-deployment-list',
            template: __webpack_require__(/*! ./deployment-list.component.html */ "./src/app/deployment/deployment-list/deployment-list.component.html"),
            providers: [primeng_api__WEBPACK_IMPORTED_MODULE_4__["MessageService"]],
            styles: [__webpack_require__(/*! ./deployment-list.component.scss */ "./src/app/deployment/deployment-list/deployment-list.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_deployment_service__WEBPACK_IMPORTED_MODULE_2__["DeploymentService"], primeng_api__WEBPACK_IMPORTED_MODULE_4__["MessageService"]])
    ], DeploymentListComponent);
    return DeploymentListComponent;
}());



/***/ }),

/***/ "./src/app/deployment/deployment-progress-indicator-dialog/deployment-progress-indicator.component.css":
/*!*************************************************************************************************************!*\
  !*** ./src/app/deployment/deployment-progress-indicator-dialog/deployment-progress-indicator.component.css ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RlcGxveW1lbnQvZGVwbG95bWVudC1wcm9ncmVzcy1pbmRpY2F0b3ItZGlhbG9nL2RlcGxveW1lbnQtcHJvZ3Jlc3MtaW5kaWNhdG9yLmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/deployment/deployment-progress-indicator-dialog/deployment-progress-indicator.component.html":
/*!**************************************************************************************************************!*\
  !*** ./src/app/deployment/deployment-progress-indicator-dialog/deployment-progress-indicator.component.html ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p-dialog *ngIf=\"deployment\"\n    header=\"{{deployment.pullRequestMeta.issueNumber}}/{{deployment.pullRequestMeta.pullId}}\"\n    [visible]=\"true\" [responsive]=\"true\" showEffect=\"fade\" [modal]=\"true\" [style]=\"{width: '60%'}\">\n    <app-deployment-progress-indicator></app-deployment-progress-indicator>\n    <p-footer>\n        <div class=\"ui-dialog-buttonpane ui-helper-clearfix\">\n            <button\n              type=\"button\" pButton (click)=\"closeDialog()\"\n              label=\"Ok\">\n            </button>\n        </div>\n    </p-footer>\n</p-dialog>\n"

/***/ }),

/***/ "./src/app/deployment/deployment-progress-indicator-dialog/deployment-progress-indicator.component.ts":
/*!************************************************************************************************************!*\
  !*** ./src/app/deployment/deployment-progress-indicator-dialog/deployment-progress-indicator.component.ts ***!
  \************************************************************************************************************/
/*! exports provided: DeploymentProgressIndicatorDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentProgressIndicatorDialogComponent", function() { return DeploymentProgressIndicatorDialogComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _deployment_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../deployment.service */ "./src/app/deployment/deployment.service.ts");




var DeploymentProgressIndicatorDialogComponent = /** @class */ (function () {
    function DeploymentProgressIndicatorDialogComponent(deploymentService) {
        this.visible = false;
        this.displayDialog = true;
        this.deploymentEvents = [];
        this.closed = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.deploymentService = deploymentService;
    }
    DeploymentProgressIndicatorDialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.deploymentService.onDeploymentStatusUpdate((function (event) {
            var found = false;
            for (var i = 0; i < _this.deploymentEvents.length; i++) {
                var existingEvent = _this.deploymentEvents[i];
                if (existingEvent.eventName === event.eventName) {
                    _this.deploymentEvents[i] = event;
                    found = true;
                    break;
                }
            }
            if (!found) {
                _this.deploymentEvents.push(event);
            }
        }));
    };
    DeploymentProgressIndicatorDialogComponent.prototype.ngOnChanges = function () {
        this.deploymentEvents = [];
    };
    Object.defineProperty(DeploymentProgressIndicatorDialogComponent.prototype, "deployment", {
        get: function () {
            return this._deployment;
        },
        set: function (deployment) {
            this.visible = true;
            this._deployment = deployment;
        },
        enumerable: true,
        configurable: true
    });
    DeploymentProgressIndicatorDialogComponent.prototype.closeDialog = function () {
        this.visible = false;
        this.closed.emit('closed');
        console.log('emitting closed');
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], DeploymentProgressIndicatorDialogComponent.prototype, "closed", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object])
    ], DeploymentProgressIndicatorDialogComponent.prototype, "deployment", null);
    DeploymentProgressIndicatorDialogComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-deployment-progress-indicator-dialog',
            template: __webpack_require__(/*! ./deployment-progress-indicator.component.html */ "./src/app/deployment/deployment-progress-indicator-dialog/deployment-progress-indicator.component.html"),
            styles: [__webpack_require__(/*! ./deployment-progress-indicator.component.css */ "./src/app/deployment/deployment-progress-indicator-dialog/deployment-progress-indicator.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_deployment_service__WEBPACK_IMPORTED_MODULE_2__["DeploymentService"]])
    ], DeploymentProgressIndicatorDialogComponent);
    return DeploymentProgressIndicatorDialogComponent;
}());



/***/ }),

/***/ "./src/app/deployment/deployment-progress-indicator/deployment-progress-indicator.component.css":
/*!******************************************************************************************************!*\
  !*** ./src/app/deployment/deployment-progress-indicator/deployment-progress-indicator.component.css ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RlcGxveW1lbnQvZGVwbG95bWVudC1wcm9ncmVzcy1pbmRpY2F0b3IvZGVwbG95bWVudC1wcm9ncmVzcy1pbmRpY2F0b3IuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/deployment/deployment-progress-indicator/deployment-progress-indicator.component.html":
/*!*******************************************************************************************************!*\
  !*** ./src/app/deployment/deployment-progress-indicator/deployment-progress-indicator.component.html ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n  <div *ngFor=\"let event of deploymentEvents\">\n    {{'deploymentStatusUpdate.' + getEventName(event.eventName) | translate:event.data}} {{getRegion(event.eventName)}}\n    <i class=\"pi\"\n      [ngClass]=\"{'pi-spin pi-spinner': event.action === 'start', 'pi-check': event.action === 'end', 'pi-times': event.action === 'failure'}\"></i>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/deployment/deployment-progress-indicator/deployment-progress-indicator.component.ts":
/*!*****************************************************************************************************!*\
  !*** ./src/app/deployment/deployment-progress-indicator/deployment-progress-indicator.component.ts ***!
  \*****************************************************************************************************/
/*! exports provided: DeploymentProgressIndicatorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentProgressIndicatorComponent", function() { return DeploymentProgressIndicatorComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _deployment_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../deployment.service */ "./src/app/deployment/deployment.service.ts");




var DeploymentProgressIndicatorComponent = /** @class */ (function () {
    function DeploymentProgressIndicatorComponent(deploymentService) {
        this.deploymentEvents = [];
        this.closed = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.deploymentService = deploymentService;
    }
    DeploymentProgressIndicatorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.deploymentService.onDeploymentStatusUpdate((function (event) {
            var found = false;
            console.log(event);
            for (var i = 0; i < _this.deploymentEvents.length; i++) {
                var existingEvent = _this.deploymentEvents[i];
                if (existingEvent.eventName === event.eventName) {
                    _this.deploymentEvents[i] = event;
                    found = true;
                    break;
                }
            }
            if (!found) {
                _this.deploymentEvents.push(event);
            }
        }));
    };
    DeploymentProgressIndicatorComponent.prototype.ngOnChanges = function () {
        this.deploymentEvents = [];
    };
    DeploymentProgressIndicatorComponent.prototype.getEventName = function (eventName) {
        return eventName.replace(/-region-[a-z0-9-]+$/g, '');
    };
    DeploymentProgressIndicatorComponent.prototype.getRegion = function (eventName) {
        var matches = eventName.match(/-region-([a-z0-9-]+)$/);
        if (!matches) {
            return '';
        }
        return "[Region: " + matches[1] + "]";
    };
    Object.defineProperty(DeploymentProgressIndicatorComponent.prototype, "deployment", {
        get: function () {
            return this._deployment;
        },
        set: function (deployment) {
            this._deployment = deployment;
        },
        enumerable: true,
        configurable: true
    });
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], DeploymentProgressIndicatorComponent.prototype, "closed", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object])
    ], DeploymentProgressIndicatorComponent.prototype, "deployment", null);
    DeploymentProgressIndicatorComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-deployment-progress-indicator',
            template: __webpack_require__(/*! ./deployment-progress-indicator.component.html */ "./src/app/deployment/deployment-progress-indicator/deployment-progress-indicator.component.html"),
            styles: [__webpack_require__(/*! ./deployment-progress-indicator.component.css */ "./src/app/deployment/deployment-progress-indicator/deployment-progress-indicator.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_deployment_service__WEBPACK_IMPORTED_MODULE_2__["DeploymentService"]])
    ], DeploymentProgressIndicatorComponent);
    return DeploymentProgressIndicatorComponent;
}());



/***/ }),

/***/ "./src/app/deployment/deployment.module.ts":
/*!*************************************************!*\
  !*** ./src/app/deployment/deployment.module.ts ***!
  \*************************************************/
/*! exports provided: DeploymentModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentModule", function() { return DeploymentModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _deployment_list_deployment_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deployment-list/deployment-list.component */ "./src/app/deployment/deployment-list/deployment-list.component.ts");
/* harmony import */ var _common_common_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/common.module */ "./src/app/common/common.module.ts");
/* harmony import */ var _deployment_list_deployment_list_pr_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./deployment-list/deployment-list-pr.component */ "./src/app/deployment/deployment-list/deployment-list-pr.component.ts");
/* harmony import */ var _deployment_list_deployment_list_rc_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./deployment-list/deployment-list-rc.component */ "./src/app/deployment/deployment-list/deployment-list-rc.component.ts");
/* harmony import */ var _deployment_progress_indicator_deployment_progress_indicator_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./deployment-progress-indicator/deployment-progress-indicator.component */ "./src/app/deployment/deployment-progress-indicator/deployment-progress-indicator.component.ts");
/* harmony import */ var _deployment_progress_indicator_dialog_deployment_progress_indicator_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./deployment-progress-indicator-dialog/deployment-progress-indicator.component */ "./src/app/deployment/deployment-progress-indicator-dialog/deployment-progress-indicator.component.ts");
/* harmony import */ var _qa_server_state_qa_server_state_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./qa-server-state/qa-server-state.component */ "./src/app/deployment/qa-server-state/qa-server-state.component.ts");
/* harmony import */ var primeng_tooltip__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/tooltip */ "./node_modules/primeng/tooltip.js");
/* harmony import */ var primeng_tooltip__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(primeng_tooltip__WEBPACK_IMPORTED_MODULE_10__);











var DeploymentModule = /** @class */ (function () {
    function DeploymentModule() {
    }
    DeploymentModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _deployment_list_deployment_list_component__WEBPACK_IMPORTED_MODULE_3__["DeploymentListComponent"],
                _deployment_list_deployment_list_pr_component__WEBPACK_IMPORTED_MODULE_5__["DeploymentListPullRequestComponent"],
                _deployment_list_deployment_list_rc_component__WEBPACK_IMPORTED_MODULE_6__["DeploymentListReleaseCandidateComponent"],
                _deployment_progress_indicator_deployment_progress_indicator_component__WEBPACK_IMPORTED_MODULE_7__["DeploymentProgressIndicatorComponent"],
                _deployment_progress_indicator_dialog_deployment_progress_indicator_component__WEBPACK_IMPORTED_MODULE_8__["DeploymentProgressIndicatorDialogComponent"],
                _qa_server_state_qa_server_state_component__WEBPACK_IMPORTED_MODULE_9__["QaServerStateComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _common_common_module__WEBPACK_IMPORTED_MODULE_4__["PackageCommonModule"],
                primeng_tooltip__WEBPACK_IMPORTED_MODULE_10__["TooltipModule"]
            ],
            exports: [
                _deployment_list_deployment_list_component__WEBPACK_IMPORTED_MODULE_3__["DeploymentListComponent"],
                _deployment_list_deployment_list_pr_component__WEBPACK_IMPORTED_MODULE_5__["DeploymentListPullRequestComponent"],
                _deployment_list_deployment_list_rc_component__WEBPACK_IMPORTED_MODULE_6__["DeploymentListReleaseCandidateComponent"]
            ]
        })
    ], DeploymentModule);
    return DeploymentModule;
}());



/***/ }),

/***/ "./src/app/deployment/deployment.service.ts":
/*!**************************************************!*\
  !*** ./src/app/deployment/deployment.service.ts ***!
  \**************************************************/
/*! exports provided: DeploymentService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentService", function() { return DeploymentService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _common_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/api.service */ "./src/app/common/api.service.ts");
/* harmony import */ var _common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/models/domain/Deployment */ "./src/app/common/models/domain/Deployment.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! socket.io-client */ "./node_modules/socket.io-client/lib/index.js");
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(socket_io_client__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _common_config_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/config.service */ "./src/app/common/config.service.ts");







var DeploymentService = /** @class */ (function () {
    function DeploymentService(api, zone, config) {
        var _this = this;
        this.serverListSubject = new rxjs__WEBPACK_IMPORTED_MODULE_4__["Subject"]();
        this.serverListObservable = this.serverListSubject.asObservable();
        this.applicationUpdatedSubject = new rxjs__WEBPACK_IMPORTED_MODULE_4__["Subject"]();
        this.applicationUpdatedObservable = this.applicationUpdatedSubject.asObservable();
        this.packageUpdaterConnectedSubject = new rxjs__WEBPACK_IMPORTED_MODULE_4__["Subject"]();
        this.packageUpdaterConnectedObservable = this.packageUpdaterConnectedSubject.asObservable();
        this.deploymentStatusUpdateSubject = new rxjs__WEBPACK_IMPORTED_MODULE_4__["Subject"]();
        this.deploymentStatusUpdateSObservable = this.deploymentStatusUpdateSubject.asObservable();
        this.zone = zone;
        this.config = config;
        this.clientInstance = api.clientInstance;
        this.socket = socket_io_client__WEBPACK_IMPORTED_MODULE_5___default()(config.locationOrigin + "?web-client=true");
        this.socket.on('client-update-available', function () {
            _this.zone.run(function () {
                _this.serverListSubject.next();
            });
        });
        this.socket.on('deployment-status-update', function (event) {
            _this.zone.run(function () {
                _this.deploymentStatusUpdateSubject.next(event);
            });
        });
        this.socket.on('application-updated', function (appMeta) {
            _this.zone.run(function () {
                _this.applicationUpdatedSubject.next(appMeta);
            });
        });
        this.socket.on('package-updater-connected', function () {
            _this.zone.run(function () {
                _this.packageUpdaterConnectedSubject.next();
            });
        });
    }
    DeploymentService.prototype.getDeployments = function (options) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var pageResult;
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clientInstance.apis.deployments.getDeployments({ options: options })];
                    case 1:
                        pageResult = _a.sent();
                        pageResult.items.forEach(function (deployment) {
                            if (deployment.pullRequestMeta && deployment.pullRequestMeta.sourceBranch) { }
                            _this.addDeploymentMetaInfo(deployment);
                        });
                        return [2 /*return*/, pageResult];
                }
            });
        });
    };
    DeploymentService.prototype.onServerListChanged = function (func) {
        this.serverListObservable.subscribe(func);
    };
    /**
     * Register listeners for application update event. Fires when an application has been updated by hermes-package-updater
     */
    DeploymentService.prototype.onApplicationUpdated = function (func) {
        this.applicationUpdatedObservable.subscribe(func);
    };
    /**
     * Register listeners for deployment status update event.
     * Fires when a deployment gets transitioned to status done, will fire for each phase
     */
    DeploymentService.prototype.onDeploymentStatusUpdate = function (func) {
        this.deploymentStatusUpdateSObservable.subscribe(func);
    };
    /**
     * Register listeners for hermes package updater connect event.
     * Fires when a new instance of hermes-package-updater connects
     */
    DeploymentService.prototype.onPackagerConnected = function (func) {
        this.packageUpdaterConnectedObservable.subscribe(func);
    };
    DeploymentService.prototype.addDeploymentMetaInfo = function (deployment) {
        var meta = {
            $isEditable: false,
            $isInstallable: false
        };
        deployment.$meta = meta;
        // pull requests and release candidate should always be installable/promotable
        meta.$isInstallable = true;
        if (!deployment.pullRequestMeta) {
            return;
        }
        var prStatus = deployment.pullRequestMeta.status;
        var isStatusEditable = ![_common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_3__["PullRequestStatus"].MERGING_BLOCKED, _common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_3__["PullRequestStatus"].PENDING_REVIEW].includes(prStatus);
        for (var prop in deployment) {
            if (prop === _common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_3__["DeploymentField"].Status && isStatusEditable) {
                meta[prop] = {
                    isEditable: true
                };
                meta.$isEditable = true;
            }
            else {
                meta[prop] = {
                    isEditable: false
                };
            }
        }
    };
    DeploymentService.prototype.updateDeployment = function (deploymentId, deployment) {
        return this.clientInstance.apis.deployments.updateDeployment({
            deploymentId: deploymentId,
            deployment: deployment
        });
    };
    DeploymentService.prototype.signalDeploymentInstall = function (options) {
        return this.clientInstance.apis.deployments.signalDeploymentInstall({
            deploymentName: options.deploymentName,
            pullId: options.pullId,
            payload: {
                stageIdentifier: options.stageIdentifier
            }
        });
    };
    DeploymentService.prototype.promoteDeployment = function (options) {
        return this.clientInstance.apis.deployments.promoteDeployment(options);
    };
    DeploymentService.prototype.getPullRequestDeploymentContext = function (band) {
        return this.clientInstance.apis.deployments.getPullRequestDeploymentContext({
            band: band
        });
    };
    DeploymentService.prototype.getServerDeploymentMeta = function (band) {
        return this.clientInstance.apis.deployments.getServerDeploymentMeta({
            band: band
        });
    };
    DeploymentService.prototype.resetDeploymentToRelease = function (deploymentName, serverTag) {
        return this.clientInstance.apis.deployments.resetDeploymentToRelease({
            deploymentName: deploymentName,
            serverTag: serverTag
        });
    };
    DeploymentService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_common_api_service__WEBPACK_IMPORTED_MODULE_2__["Api"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"], _common_config_service__WEBPACK_IMPORTED_MODULE_6__["Config"]])
    ], DeploymentService);
    return DeploymentService;
}());



/***/ }),

/***/ "./src/app/deployment/qa-server-state/qa-server-state.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/deployment/qa-server-state/qa-server-state.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RlcGxveW1lbnQvcWEtc2VydmVyLXN0YXRlL3FhLXNlcnZlci1zdGF0ZS5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/deployment/qa-server-state/qa-server-state.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/deployment/qa-server-state/qa-server-state.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p-toast [style]=\"{marginTop: '80px'}\"></p-toast>\n\n<p-table #dt [columns]=\"cols\" [value]=\"serverDeploymentList\" dataKey=\"serverTag\">\n  <ng-template pTemplate=\"caption\">\n\n  </ng-template>\n  <ng-template pTemplate=\"header\" let-columns>\n    <tr>\n      <th *ngFor=\"let col of columns\">\n        {{col.header}}\n      </th>\n      <th style=\"width: 7em\"></th>\n    </tr>\n    <tr>\n      <th *ngFor=\"let col of columns\" [ngSwitch]=\"col.field\">\n        <p-dropdown *ngSwitchCase=\"'serverTag'\" [options]=\"serverTags\" [style]=\"{'width':'100%'}\"\n          (onChange)=\"dt.filter($event.value, col.field, 'equals')\"></p-dropdown>\n      </th>\n      <th></th>\n    </tr>\n  </ng-template>\n\n\n  <ng-template pTemplate=\"body\" let-rowData let-ri=\"rowIndex\" let-editing=\"editing\">\n    <tr [pEditableRow]=\"rowData\">\n      <td *ngFor=\"let col of cols;\">\n        <div>\n          {{col.renderer ? col.renderer(rowData) : rowData[col.field]}}\n        </div>\n      </td>\n      <td>\n        <div *ngIf=\"rowData.pullRequestMeta\">\n            <button *ngIf=\"!rowData.updateMeta.isUpdating\" type=\"button\" class=\"pi pi-refresh\" pTooltip=\"Reset to release\"\n            (click)=\"resetDeploymentToRelease(rowData)\">\n            </button>\n            <div *ngIf=\"rowData.updateMeta.isUpdating\" pTooltip=\"Updating to version {{getUpdateVersion(rowData.updateMeta)}}\">\n                <i class=\"pi pi-spin pi-spinner\"></i>\n            </div>\n        </div>\n      </td>\n    </tr>\n  </ng-template>\n</p-table>\n"

/***/ }),

/***/ "./src/app/deployment/qa-server-state/qa-server-state.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/deployment/qa-server-state/qa-server-state.component.ts ***!
  \*************************************************************************/
/*! exports provided: QaServerStateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QaServerStateComponent", function() { return QaServerStateComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _deployment_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../deployment.service */ "./src/app/deployment/deployment.service.ts");
/* harmony import */ var src_app_common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/common/models/domain/Deployment */ "./src/app/common/models/domain/Deployment.ts");
/* harmony import */ var src_app_utils_deployment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/utils/deployment */ "./src/app/utils/deployment.ts");





var QaServerStateComponent = /** @class */ (function () {
    function QaServerStateComponent(deploymentService, zone) {
        this.cols = [
            { field: 'serverTag', header: 'Server', isEditable: false },
            { field: 'deploymentName', header: 'Name', isEditable: false },
            { field: 'version', header: 'Installed version', isEditable: false, renderer: function (_a) {
                    var version = _a.version, pullRequestMeta = _a.pullRequestMeta;
                    return Object(src_app_utils_deployment__WEBPACK_IMPORTED_MODULE_4__["formatDeploymentVersion"])(version, pullRequestMeta);
                } }
        ];
        this.deploymentService = deploymentService;
        this.zone = zone;
    }
    QaServerStateComponent.prototype.ngOnInit = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setServerDeploymentMeta()];
                    case 1:
                        _a.sent();
                        this.deploymentService.onServerListChanged(function () {
                            _this.setServerDeploymentMeta();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    QaServerStateComponent.prototype.setServerDeploymentMeta = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var _a;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.deploymentService.getServerDeploymentMeta(src_app_common_models_domain_Deployment__WEBPACK_IMPORTED_MODULE_3__["DeploymentBand"].QA)];
                    case 1:
                        _a.serverDeploymentList = _b.sent();
                        this.serverTags = this.serverDeploymentList.reduce(function (options, deployment) {
                            var hasOption = options.some(function (option) { return option.value === deployment.serverTag; });
                            if (!hasOption) {
                                options.push({
                                    value: deployment.serverTag,
                                    label: deployment.serverTag
                                });
                            }
                            return options;
                        }, []);
                        return [2 /*return*/];
                }
            });
        });
    };
    QaServerStateComponent.prototype.getUpdateVersion = function (_a) {
        var updateVersion = _a.updateVersion, pullRequestMeta = _a.pullRequestMeta;
        return Object(src_app_utils_deployment__WEBPACK_IMPORTED_MODULE_4__["formatDeploymentVersion"])(updateVersion, pullRequestMeta);
    };
    QaServerStateComponent.prototype.resetDeploymentToRelease = function (rowData) {
        var _this = this;
        this.zone.run(function () {
            return _this.deploymentService.resetDeploymentToRelease(rowData.deploymentName, rowData.serverTag);
        });
    };
    QaServerStateComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-qa-server-state',
            template: __webpack_require__(/*! ./qa-server-state.component.html */ "./src/app/deployment/qa-server-state/qa-server-state.component.html"),
            styles: [__webpack_require__(/*! ./qa-server-state.component.css */ "./src/app/deployment/qa-server-state/qa-server-state.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_deployment_service__WEBPACK_IMPORTED_MODULE_2__["DeploymentService"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"]])
    ], QaServerStateComponent);
    return QaServerStateComponent;
}());



/***/ }),

/***/ "./src/app/local-storage.service.ts":
/*!******************************************!*\
  !*** ./src/app/local-storage.service.ts ***!
  \******************************************/
/*! exports provided: LocalStorageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalStorageService", function() { return LocalStorageService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var LocalStorageService = /** @class */ (function () {
    function LocalStorageService() {
        this.prefix = 'hermes-packages';
    }
    LocalStorageService.prototype.getItem = function (key) {
        key = this.prefix + "." + key;
        var val = localStorage.getItem(key);
        if (val) {
            try {
                val = JSON.parse(val);
            }
            catch (err) {
                // no op
            }
        }
        var parseIntVal = parseInt(val, 10);
        // tslint:disable-next-line:triple-equals
        if (parseIntVal == val) {
            return parseIntVal;
        }
        if (val === 'true') {
            return true;
        }
        else if (val === 'false') {
            return false;
        }
        return val;
    };
    LocalStorageService.prototype.setItem = function (key, value) {
        key = this.prefix + "." + key;
        localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    };
    LocalStorageService.prototype.removeItem = function (key) {
        key = this.prefix + "." + key;
        localStorage.removeItem(key);
    };
    LocalStorageService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], LocalStorageService);
    return LocalStorageService;
}());



/***/ }),

/***/ "./src/app/overview/overview.component.css":
/*!*************************************************!*\
  !*** ./src/app/overview/overview.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL292ZXJ2aWV3L292ZXJ2aWV3LmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/overview/overview.component.html":
/*!**************************************************!*\
  !*** ./src/app/overview/overview.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<app-server-state-list></app-server-state-list>\n<app-deployment-list></app-deployment-list>\n"

/***/ }),

/***/ "./src/app/overview/overview.component.ts":
/*!************************************************!*\
  !*** ./src/app/overview/overview.component.ts ***!
  \************************************************/
/*! exports provided: OverviewComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OverviewComponent", function() { return OverviewComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var OverviewComponent = /** @class */ (function () {
    function OverviewComponent() {
    }
    OverviewComponent.prototype.ngOnInit = function () {
    };
    OverviewComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-overview',
            template: __webpack_require__(/*! ./overview.component.html */ "./src/app/overview/overview.component.html"),
            styles: [__webpack_require__(/*! ./overview.component.css */ "./src/app/overview/overview.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], OverviewComponent);
    return OverviewComponent;
}());



/***/ }),

/***/ "./src/app/project/project-list/project-list.component.css":
/*!*****************************************************************!*\
  !*** ./src/app/project/project-list/project-list.component.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".p-d-flex {\n  display: flex;\n}\n.p-jc-between {\n  justify-content: space-between;\n}\n.form__input-container {\n  display: inline;\n}\ninput.p-invalid {\n  border: 1px solid red;\n}\n.p-invalid {\n  color: red;\n}\n.ui-g-05 {\n  width: 4%;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcHJvamVjdC9wcm9qZWN0LWxpc3QvcHJvamVjdC1saXN0LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxhQUFhO0FBQ2Y7QUFDQTtFQUNFLDhCQUE4QjtBQUNoQztBQUVBO0VBQ0UsZUFBZTtBQUNqQjtBQUVBO0VBQ0UscUJBQXFCO0FBQ3ZCO0FBRUE7RUFDRSxVQUFVO0FBQ1o7QUFFQTtFQUNFLFNBQVM7QUFDWCIsImZpbGUiOiJzcmMvYXBwL3Byb2plY3QvcHJvamVjdC1saXN0L3Byb2plY3QtbGlzdC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnAtZC1mbGV4IHtcbiAgZGlzcGxheTogZmxleDtcbn1cbi5wLWpjLWJldHdlZW4ge1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG59XG5cbi5mb3JtX19pbnB1dC1jb250YWluZXIge1xuICBkaXNwbGF5OiBpbmxpbmU7XG59XG5cbmlucHV0LnAtaW52YWxpZCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJlZDtcbn1cblxuLnAtaW52YWxpZCB7XG4gIGNvbG9yOiByZWQ7XG59XG5cbi51aS1nLTA1IHtcbiAgd2lkdGg6IDQlO1xufVxuIl19 */"

/***/ }),

/***/ "./src/app/project/project-list/project-list.component.html":
/*!******************************************************************!*\
  !*** ./src/app/project/project-list/project-list.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p-toast [style]=\"{marginTop: '80px'}\"></p-toast>\n\n<p-toast position=\"center\" key=\"c\" [modal]=\"true\" [baseZIndex]=\"5000\">\n  <ng-template let-message pTemplate=\"message\">\n    <div style=\"text-align: center\">\n      <i class=\"pi pi-exclamation-triangle\" style=\"font-size: 3em\"></i>\n      <h3>{{message.summary}}</h3>\n      <p>{{message.detail}}</p>\n    </div>\n    <div class=\"ui-g ui-fluid\">\n      <div class=\"ui-g-6\">\n        <button type=\"button\" pButton label=\"Yes\" class=\"ui-button-success\"></button>\n      </div>\n      <div class=\"ui-g-6\">\n        <button type=\"button\" pButton label=\"No\" class=\"ui-button-secondary\"></button>\n      </div>\n    </div>\n  </ng-template>\n</p-toast>\n\n<p-table #dt [columns]=\"cols\" [value]=\"projects\" [lazy]=\"true\" (onLazyLoad)=\"loadProjects($event)\"\n  [tableStyle]=\"{'table-layout':'auto'}\" [totalRecords]=\"totalDeployments\" [loading]=\"loading\"\n  [rowsPerPageOptions]=\"[10,20,30]\" [paginator]=\"true\" [rows]=\"10\" dataKey=\"id\" editMode=\"row\">\n\n  <ng-template pTemplate=\"caption\">\n    <div class=\"p-d-flex p-ai-center p-jc-between\">\n      Projects\n      <button type=\"button\" pButton icon=\"pi pi-check\" (click)=\"showNewProjectDialog()\" label=\"New project\">\n      </button>\n    </div>\n  </ng-template>\n\n  <ng-template pTemplate=\"header\" let-columns>\n    <tr>\n      <th *ngFor=\"let col of columns\" [pSortableColumn]=\"col.isSortable && col.field\">\n        {{col.header}}\n        <p-sortIcon [field]=\"col.field\" ariaLabel=\"Activate to sort\" *ngIf=\"col.isSortable\"\n          ariaLabelDesc=\"Activate to sort in descending order\" ariaLabelAsc=\"Activate to sort in ascending order\">\n        </p-sortIcon>\n      </th>\n      <th class=\"edit-column\"></th>\n    </tr>\n    <tr>\n      <th *ngFor=\"let col of columns\" [ngSwitch]=\"col.field\">\n      </th>\n      <th></th>\n    </tr>\n  </ng-template>\n\n\n  <ng-template pTemplate=\"body\" let-rowData let-ri=\"rowIndex\" let-editing=\"editing\">\n    <tr [pEditableRow]=\"rowData\">\n      <td *ngFor=\"let col of cols;\">\n        <div *ngIf=\"col.field !== 'jiraStatus.name'\">\n          <div [innerHTML]=\"getCellValue(rowData, col)\">\n          </div>\n        </div>\n        <p-cellEditor *ngIf=\"col.field === 'jiraStatus.name'\">\n          <ng-template pTemplate=\"input\">\n            <p-dropdown [options]=\"rowData.presentationTransitionList\" [style]=\"{'width':'100%'}\"\n              [(ngModel)]=\"rowData.jiraStatus.id\">\n\n            </p-dropdown>\n          </ng-template>\n          <ng-template pTemplate=\"output\">\n            {{getCellValue(rowData, col)}}\n          </ng-template>\n        </p-cellEditor>\n      </td>\n\n      <td style=\"text-align:center\">\n        <div *ngIf=\"rowData.$meta.$isEditable\" style=\"display: inline-block\">\n          <button *ngIf=\"!editing\" type=\"button\" pInitEditableRow class=\"pi pi-pencil\"\n            (click)=\"editing = true && onRowEditInit(rowData)\"></button>\n          <button *ngIf=\"editing\" type=\"button\" pSaveEditableRow class=\"pi pi-check\" style=\"margin-right: .5em\"\n            (click)=\"onRowEditSave(rowData)\"></button>\n          <button *ngIf=\"editing\" type=\"button\" pCancelEditableRow class=\"pi pi-times\"\n            (click)=\"editing = false && onRowEditCancel(rowData, ri)\"></button>\n        </div>\n        <button *ngIf=\"rowData.$meta.$isInstallable && !editing\" type=\"button\" class=\"pi pi-cloud-upload\"\n          (click)=\"showInstallDeploymentDialog(rowData)\"></button>\n      </td>\n    </tr>\n  </ng-template>\n</p-table>\n\n<p-dialog header=\"New project\" [(visible)]=\"displayDialog\" [responsive]=\"true\" showEffect=\"fade\" [modal]=\"true\"\n  [style]=\"{width: '70%'}\">\n  <div class=\"ui-g ui-fluid\">\n    <div class=\"ui-g-12\">\n      <div class=\"ui-g-4\">\n        <input type=\"text\" pInputText [(ngModel)]=\"projectName\" placeholder=\"Name\" />\n      </div>\n    </div>\n\n\n    <div class=\"ui-g-12\">\n      <h3>Stages</h3>\n    </div>\n    <div *ngFor=\"let stage of projectStages; let idx = index\">\n      <div class=\"ui-g-12\">\n        <div class=\"ui-g-3\">\n          <p-dropdown [options]=\"[{label: 'qa', value: 'qa'}, {label: 'production', value: 'production'}]\"\n            [style]=\"{'width':'100%'}\" [(ngModel)]=\"stage.band\">\n          </p-dropdown>\n        </div>\n\n        <div class=\"ui-g-3\">\n          <p-dropdown [options]=\"[{label: 'on-premise', value: 'on-premise'}, {label: 'aws', value: 'aws'}]\"\n            [style]=\"{'width':'100%'}\" [(ngModel)]=\"stage.type\">\n          </p-dropdown>\n        </div>\n\n        <div class=\"ui-g-3\">\n          <p-dropdown\n            [options]=\"[{label: '', value: ''}, {label: 'lambda', value: 'lambda'}, {label: 's3', value: 's3'}]\"\n            [style]=\"{'width':'100%'}\" [(ngModel)]=\"stage.resourceType\">\n          </p-dropdown>\n        </div>\n\n\n        <div class=\"ui-g-2\">\n          <input type=\"text\" ngClass=\"{'p-invalid': getPropError(stage, 'resourceName')}\" pInputText\n            [(ngModel)]=\"stage.resourceName\" placeholder=\"Resource name\" />\n          <small class=\"p-invalid\"\n            *ngIf=\"getPropError(stage, 'resourceName')\">{{getPropError(stage, 'resourceName')}}</small>\n        </div>\n\n        <div class=\"ui-g-3\" *ngIf=\"stage.resourceType === 's3'\">\n          <input type=\"text\" ngClass=\"{'p-invalid': getPropError(stage, 'cloudfrontDistributionId')}\" pInputText\n            [(ngModel)]=\"stage.cloudfrontDistributionId\" placeholder=\"Cloudfront distribution id\" />\n        </div>\n\n        <div class=\"ui-g-3\" *ngIf=\"stage.resourceType === 's3'\">\n          <input type=\"text\" ngClass=\"{'p-invalid': getPropError(stage, 'cloudfrontInvalidationPattern')}\" pInputText\n            [(ngModel)]=\"stage.cloudfrontInvalidationPattern\" placeholder=\"Invalidation pattern\" />\n        </div>\n\n        <div class=\"ui-g-1 ui-g-05\">\n          <button *ngIf=\"idx === projectStages.length - 1\" type=\"button\" pButton icon=\"pi pi-plus\"\n            (click)=\"addNewStage()\" [disabled]=\"!canAddStage()\">\n          </button>\n        </div>\n\n        <div class=\"ui-g-1 ui-g-05\">\n          <button *ngIf=\"projectStages.length > 1\" type=\"button\" pButton icon=\"pi pi-times\" (click)=\"removeStage(stage)\"\n            [disabled]=\"projectStages.length === 1\">\n          </button>\n        </div>\n      </div>\n\n      <div class=\"ui-g-6\" style=\"width: auto;\" *ngIf=\"stage.type === 'aws'\">\n        <h3>Regions</h3>\n        <p-chips *ngIf=\"stage.type === 'aws'\" [(ngModel)]=\"stage.regions\" placeholder=\"Regions\"></p-chips>\n      </div>\n    </div>\n\n  </div>\n  <p-footer>\n    <div class=\"ui-dialog-buttonpane ui-helper-clearfix\">\n      <button type=\"button\" pButton icon=\"pi pi-check\" (click)=\"createProject()\" label=\"Create\"\n        [disabled]=\"!canCreateProject()\">\n      </button>\n    </div>\n  </p-footer>\n</p-dialog>\n\n<app-loading-mask></app-loading-mask>\n"

/***/ }),

/***/ "./src/app/project/project-list/project-list.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/project/project-list/project-list.component.ts ***!
  \****************************************************************/
/*! exports provided: ProjectListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProjectListComponent", function() { return ProjectListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/api */ "./node_modules/primeng/api.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(primeng_api__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _project_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../project.service */ "./src/app/project/project.service.ts");




var COLUMNS = [
    {
        field: 'name', header: 'Name', isEditable: false, isSortable: false
    },
    {
        field: 'stages', header: 'Stages', isEditable: false, isSortable: false,
        renderer: function (data) {
            return data.stages.map(function (stage) {
                var regions = stage.regions && stage.regions.length ? "[" + stage.regions.join('') + "]" : '';
                return "[" + stage.type + "] [" + stage.band + "] - " + stage.resourceName + " " + stage.resourceType + " " + regions;
            }).map(function (val) { return "<div>" + val + "</div>"; }).join('');
        }
    }
];
var ProjectListComponent = /** @class */ (function () {
    function ProjectListComponent(deploymentService, messageService) {
        this.defaultStage = {
            type: 'aws',
            band: 'qa',
            regions: ['eu-west-1'],
            resourceName: null,
            resourceType: 'lambda',
            runtime: 'nodejs'
        };
        this.projectStages = [JSON.parse(JSON.stringify(this.defaultStage))];
        this.projects = [];
        this.loading = true;
        this.paginationOptions = { query: {} };
        this.projectService = deploymentService;
        this.messageService = messageService;
    }
    ProjectListComponent.prototype.ngOnInit = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                this.setColumnConfig();
                return [2 /*return*/];
            });
        });
    };
    ProjectListComponent.prototype.loadProjects = function (_a) {
        var first = _a.first, rows = _a.rows, sortField = _a.sortField, sortOrder = _a.sortOrder;
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var pageResult;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.loading = true;
                        return [4 /*yield*/, this.projectService.getProjects()];
                    case 1:
                        pageResult = _b.sent();
                        // this.deployments = DeploymentMapper.toPresentationDeploymentList(pageResult.items);
                        this.totalDeployments = pageResult.totalCount;
                        this.projects = pageResult.items;
                        this.loading = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    ProjectListComponent.prototype.onRowEditInit = function (project) {
        /*  this.messageService.add({severity: 'info', summary: 'on edit init', detail: 'on edit init'}); */
    };
    ProjectListComponent.prototype.onRowEditSave = function (project) {
    };
    ProjectListComponent.prototype.onProgressIndicatorClosed = function () {
    };
    ProjectListComponent.prototype.onRowEditCancel = function (project, index) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Car is updated' });
    };
    ProjectListComponent.prototype.setColumnConfig = function () {
        this.cols = COLUMNS;
    };
    ProjectListComponent.prototype.showInstallDeploymentDialog = function (project) { };
    ProjectListComponent.prototype.showNewProjectDialog = function () {
        this.displayDialog = true;
    };
    ProjectListComponent.prototype.createProject = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.projectService.createProject({
                            name: this.projectName,
                            stages: this.projectStages
                        })];
                    case 1:
                        _a.sent();
                        this.displayDialog = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    ProjectListComponent.prototype.canCreateProject = function () {
        if (!this.projectName) {
            return false;
        }
        if (!this.canAddStage()) {
            return false;
        }
        return true;
    };
    ProjectListComponent.prototype.isValidStage = function (stage) {
        if (stage.type === 'aws') {
            if (!stage.resourceName || !stage.resourceType) {
                return false;
            }
        }
        return !this.getPropError(stage, 'resourceName');
    };
    ProjectListComponent.prototype.canAddStage = function () {
        for (var _i = 0, _a = this.projectStages; _i < _a.length; _i++) {
            var stage = _a[_i];
            if (!this.isValidStage(stage)) {
                return false;
            }
        }
        return true;
    };
    ProjectListComponent.prototype.addNewStage = function () {
        this.projectStages.push(JSON.parse(JSON.stringify(this.defaultStage)));
    };
    ProjectListComponent.prototype.removeStage = function (stage) {
        this.projectStages = this.projectStages.filter(function (s) { return s.type !== stage.type; });
    };
    ProjectListComponent.prototype.getPropError = function (stage, prop) {
        if (prop === 'name') {
            if (!this.isUniqueStageProp(stage, prop)) {
                return 'Should be unique';
            }
            return;
        }
        if (prop === 'resourceName' && stage.type === 'aws') {
            if (!stage.resourceName) {
                return "Missing " + prop;
            }
            if (!this.isUniqueStageProp(stage, prop)) {
                return 'Should be unique';
            }
            return;
        }
        if (prop === 'resourceType' && stage.type === 'aws') {
            if (!stage[prop]) {
                return "Missing " + prop;
            }
        }
        return;
    };
    ProjectListComponent.prototype.isUniqueStageProp = function (stage, prop) {
        var count = this.projectStages.filter(function (s) { return s[prop] === stage[prop]; }).length;
        return count === 1;
    };
    ProjectListComponent.prototype.getCellValue = function (rowData, _a) {
        var field = _a.field, renderer = _a.renderer;
        var dataIndexes = field.split('.');
        var val = rowData;
        for (var i = 0; i < dataIndexes.length; i++) {
            var dataIndex = dataIndexes[i];
            val = val[dataIndex];
            if (!val || typeof val !== 'object') {
                break;
            }
        }
        if (renderer) {
            val = renderer(rowData);
        }
        return val;
    };
    ProjectListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-project-list',
            template: __webpack_require__(/*! ./project-list.component.html */ "./src/app/project/project-list/project-list.component.html"),
            providers: [primeng_api__WEBPACK_IMPORTED_MODULE_2__["MessageService"]],
            styles: [__webpack_require__(/*! ./project-list.component.css */ "./src/app/project/project-list/project-list.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_project_service__WEBPACK_IMPORTED_MODULE_3__["ProjectService"], primeng_api__WEBPACK_IMPORTED_MODULE_2__["MessageService"]])
    ], ProjectListComponent);
    return ProjectListComponent;
}());



/***/ }),

/***/ "./src/app/project/project.module.ts":
/*!*******************************************!*\
  !*** ./src/app/project/project.module.ts ***!
  \*******************************************/
/*! exports provided: ProjectModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProjectModule", function() { return ProjectModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _project_list_project_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./project-list/project-list.component */ "./src/app/project/project-list/project-list.component.ts");
/* harmony import */ var _common_common_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/common.module */ "./src/app/common/common.module.ts");
/* harmony import */ var primeng_tooltip__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/tooltip */ "./node_modules/primeng/tooltip.js");
/* harmony import */ var primeng_tooltip__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(primeng_tooltip__WEBPACK_IMPORTED_MODULE_5__);






var ProjectModule = /** @class */ (function () {
    function ProjectModule() {
    }
    ProjectModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _project_list_project_list_component__WEBPACK_IMPORTED_MODULE_3__["ProjectListComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _common_common_module__WEBPACK_IMPORTED_MODULE_4__["PackageCommonModule"],
                primeng_tooltip__WEBPACK_IMPORTED_MODULE_5__["TooltipModule"]
            ],
            exports: [
                _project_list_project_list_component__WEBPACK_IMPORTED_MODULE_3__["ProjectListComponent"]
            ]
        })
    ], ProjectModule);
    return ProjectModule;
}());



/***/ }),

/***/ "./src/app/project/project.service.ts":
/*!********************************************!*\
  !*** ./src/app/project/project.service.ts ***!
  \********************************************/
/*! exports provided: ProjectService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProjectService", function() { return ProjectService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _common_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/api.service */ "./src/app/common/api.service.ts");
/* harmony import */ var _common_config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/config.service */ "./src/app/common/config.service.ts");




var ProjectService = /** @class */ (function () {
    function ProjectService(api, zone, config) {
        this.clientInstance = api.clientInstance;
    }
    ProjectService.prototype.createProject = function (project) {
        return this.clientInstance.apis.projects.createProject({
            project: project
        });
    };
    ProjectService.prototype.getProjects = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var projects;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clientInstance.apis.projects.getProjects()];
                    case 1:
                        projects = _a.sent();
                        projects.forEach(function (project) {
                            project.$meta = {
                                $isEditable: false,
                                $isInstallable: false
                            };
                        });
                        return [2 /*return*/, {
                                hasMore: false,
                                items: projects,
                                totalCount: projects.length,
                                totalPages: 1
                            }];
                }
            });
        });
    };
    ProjectService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_common_api_service__WEBPACK_IMPORTED_MODULE_2__["Api"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"], _common_config_service__WEBPACK_IMPORTED_MODULE_3__["Config"]])
    ], ProjectService);
    return ProjectService;
}());



/***/ }),

/***/ "./src/app/server-state/server-state-list/server-state-list.component.css":
/*!********************************************************************************!*\
  !*** ./src/app/server-state/server-state-list/server-state-list.component.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3NlcnZlci1zdGF0ZS9zZXJ2ZXItc3RhdGUtbGlzdC9zZXJ2ZXItc3RhdGUtbGlzdC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/server-state/server-state-list/server-state-list.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/server-state/server-state-list/server-state-list.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p-toast [style]=\"{marginTop: '80px'}\"></p-toast>\n\n<p-table #dt [columns]=\"cols\" [value]=\"serverDeploymentList\" dataKey=\"serverTag\">\n    <ng-template pTemplate=\"caption\">\n\n    </ng-template>\n    <ng-template pTemplate=\"header\" let-columns>\n      <tr>\n        <th *ngFor=\"let col of columns\">\n          {{col.header}}\n        </th>\n      </tr>\n      <tr>\n        <th *ngFor=\"let col of columns\" [ngSwitch]=\"col.field\">\n          <p-dropdown *ngSwitchCase=\"'serverTag'\" [options]=\"serverTags\" [style]=\"{'width':'100%'}\"\n            (onChange)=\"dt.filter($event.value, col.field, 'equals')\"></p-dropdown>\n        </th>\n      </tr>\n    </ng-template>\n\n\n    <ng-template pTemplate=\"body\" let-rowData let-ri=\"rowIndex\" let-editing=\"editing\">\n      <tr [pEditableRow]=\"rowData\">\n        <td  *ngFor=\"let col of cols;\">\n           <div *ngIf=\"col.field !== 'status'\">\n              {{col.renderer ? col.renderer(rowData) : rowData[col.field]}}\n           </div>\n           <div *ngIf=\"col.field === 'status'\">\n             <div *ngIf=\"rowData.version === rowData.lastVersion\">\n               Up to date\n              <label class=\"pi pi-check\"></label>\n            </div>\n            <div *ngIf=\"!rowData.lastVersion\">\n                No deployment found\n                <label class=\"pi pi-times\"></label>\n            </div>\n           </div>\n        </td>\n      </tr>\n    </ng-template>\n  </p-table>\n"

/***/ }),

/***/ "./src/app/server-state/server-state-list/server-state-list.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/server-state/server-state-list/server-state-list.component.ts ***!
  \*******************************************************************************/
/*! exports provided: ServerStateListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServerStateListComponent", function() { return ServerStateListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_deployment_deployment_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/deployment/deployment.service */ "./src/app/deployment/deployment.service.ts");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/api */ "./node_modules/primeng/api.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(primeng_api__WEBPACK_IMPORTED_MODULE_3__);




var ServerStateListComponent = /** @class */ (function () {
    function ServerStateListComponent(deploymentService) {
        this.cols = [
            { field: 'serverTag', header: 'Server', isEditable: false },
            { field: 'band', header: 'Band', isEditable: false },
            { field: 'deploymentName', header: 'Name', isEditable: false },
            { field: 'version', header: 'Installed version', isEditable: false, renderer: function (_a) {
                    var version = _a.version, pr = _a.pullRequestMeta;
                    if (pr) {
                        return version + "-prid-" + pr.pullId + "/" + pr.issueNumber;
                    }
                    return version;
                } },
            { field: 'lastVersion', header: 'Last available version', isEditable: false },
            { field: 'status', header: 'Status', isEditable: false },
        ];
        this.deploymentService = deploymentService;
    }
    ServerStateListComponent.prototype.ngOnInit = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setServerDeploymentMeta()];
                    case 1:
                        _a.sent();
                        this.deploymentService.onServerListChanged(function () {
                            _this.setServerDeploymentMeta();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerStateListComponent.prototype.setServerDeploymentMeta = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var _a;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.deploymentService.getServerDeploymentMeta()];
                    case 1:
                        _a.serverDeploymentList = _b.sent();
                        this.serverTags = this.serverDeploymentList.reduce(function (options, deployment) {
                            var hasOption = options.some(function (option) { return option.value === deployment.serverTag; });
                            if (!hasOption) {
                                options.push({
                                    value: deployment.serverTag,
                                    label: deployment.serverTag
                                });
                            }
                            return options;
                        }, []);
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerStateListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-server-state-list',
            template: __webpack_require__(/*! ./server-state-list.component.html */ "./src/app/server-state/server-state-list/server-state-list.component.html"),
            providers: [primeng_api__WEBPACK_IMPORTED_MODULE_3__["MessageService"]],
            styles: [__webpack_require__(/*! ./server-state-list.component.css */ "./src/app/server-state/server-state-list/server-state-list.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_deployment_deployment_service__WEBPACK_IMPORTED_MODULE_2__["DeploymentService"]])
    ], ServerStateListComponent);
    return ServerStateListComponent;
}());



/***/ }),

/***/ "./src/app/server-state/server-state.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/server-state/server-state.module.ts ***!
  \*****************************************************/
/*! exports provided: ServerStateModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServerStateModule", function() { return ServerStateModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _server_state_list_server_state_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./server-state-list/server-state-list.component */ "./src/app/server-state/server-state-list/server-state-list.component.ts");
/* harmony import */ var _common_common_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/common.module */ "./src/app/common/common.module.ts");





var ServerStateModule = /** @class */ (function () {
    function ServerStateModule() {
    }
    ServerStateModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_server_state_list_server_state_list_component__WEBPACK_IMPORTED_MODULE_3__["ServerStateListComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _common_common_module__WEBPACK_IMPORTED_MODULE_4__["PackageCommonModule"]
            ],
            exports: [
                _server_state_list_server_state_list_component__WEBPACK_IMPORTED_MODULE_3__["ServerStateListComponent"]
            ]
        })
    ], ServerStateModule);
    return ServerStateModule;
}());



/***/ }),

/***/ "./src/app/sidebar/sidebar.component.css":
/*!***********************************************!*\
  !*** ./src/app/sidebar/sidebar.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3NpZGViYXIvc2lkZWJhci5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/sidebar/sidebar.component.html":
/*!************************************************!*\
  !*** ./src/app/sidebar/sidebar.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"grid\" *ngIf=\"userService.isUserLoggedIn()\">\n  <header class=\"header\">\n    <i class=\"fas fa-bars header__menu\"></i>\n    <div class=\"header__search\">\n    </div>\n    <!--  <div class=\"header__avatar\">\n        <div class=\"dropdown\">\n          <ul class=\"dropdown__list\">\n            <li class=\"dropdown__list-item\">\n              <span class=\"dropdown__icon\"><i class=\"far fa-user\"></i></span>\n              <span class=\"dropdown__title\">my profile</span>\n            </li>\n            <li class=\"dropdown__list-item\">\n              <span class=\"dropdown__icon\"><i class=\"fas fa-clipboard-list\"></i></span>\n              <span class=\"dropdown__title\">my account</span>\n            </li>\n            <li class=\"dropdown__list-item\">\n              <span class=\"dropdown__icon\"><i class=\"fas fa-sign-out-alt\"></i></span>\n              <span class=\"dropdown__title\">log out</span>\n            </li>\n          </ul>\n        </div>\n      </div> -->\n  </header>\n\n  <aside class=\"sidenav\">\n    <div class=\"sidenav__brand\">\n      <i class=\"fas fa-feather-alt sidenav__brand-icon\"></i>\n      <a class=\"sidenav__brand-link\" href=\"#\"><span class=\"text-light\"></span></a>\n      <i class=\"fas fa-times sidenav__brand-close\"></i>\n    </div>\n    <div class=\"sidenav__profile\">\n      <div class=\"sidenav__profile-avatar\" [ngStyle]=\"{'background-image': 'url(' + userProfile['avatar_url'] + ')'}\"></div>\n      <div class=\"sidenav__profile-title text-light\">{{ userProfile.firstName}} {{ userProfile.lastName }}</div>\n    </div>\n    <div class=\"row row--align-v-center row--align-h-center\">\n      <ul class=\"navList\">\n        <li class=\"navList__heading\">admin<i class=\"far fa-file-alt\"></i></li>\n        <li>\n          <div class=\"navList__subheading row row--align-v-center\">\n            <span class=\"navList__subheading-icon\"><i class=\"fas fa-briefcase-medical\"></i></span>\n            <span class=\"navList__subheading-title\" (click)=\"doRoute('projects')\">projects</span>\n          </div>\n        </li>\n\n        <li class=\"navList__heading\">deployments<i class=\"far fa-file-alt\"></i></li>\n        <li>\n          <div class=\"navList__subheading row row--align-v-center\">\n            <span class=\"navList__subheading-icon\"><i class=\"fas fa-briefcase-medical\"></i></span>\n            <span class=\"navList__subheading-title\" (click)=\"doRoute('overview')\">overview</span>\n          </div>\n        </li>\n        <li>\n          <div class=\"navList__subheading row row--align-v-center\" routerLink=\"servers\" [routerLinkActive]=\"['active']\">\n            <span class=\"navList__subheading-icon\"><i class=\"fas fa-plane-departure\"></i></span>\n            <span class=\"navList__subheading-title\">server state</span>\n          </div>\n        </li>\n        <li>\n          <div class=\"navList__subheading row row--align-v-center\" routerLink=\"deployments/pull-request\"\n            [routerLinkActive]=\"['active']\">\n            <span class=\"navList__subheading-icon\"><i class=\"far fa-angry\"></i></span>\n            <span class=\"navList__subheading-title active\">pull requests</span>\n          </div>\n        </li>\n        <li>\n          <div class=\"navList__subheading row row--align-v-center\" routerLink=\"deployments/release-candidate\"\n            [routerLinkActive]=\"['active']\">\n            <span class=\"navList__subheading-icon\"><i class=\"far fa-angry\"></i></span>\n            <span class=\"navList__subheading-title\">release candidates</span>\n          </div>\n        </li>\n      </ul>\n    </div>\n  </aside>\n\n  <main class=\"main\">\n    <ng-content></ng-content>\n  </main>\n\n  <footer class=\"footer\">\n  </footer>\n</div>\n"

/***/ }),

/***/ "./src/app/sidebar/sidebar.component.ts":
/*!**********************************************!*\
  !*** ./src/app/sidebar/sidebar.component.ts ***!
  \**********************************************/
/*! exports provided: SidebarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SidebarComponent", function() { return SidebarComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _authorization_user_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../authorization/user.service */ "./src/app/authorization/user.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");




var SidebarComponent = /** @class */ (function () {
    function SidebarComponent(userService, router) {
        this.userService = userService;
        this.router = router;
        this.userProfile = this.userService.getUserProfile();
    }
    SidebarComponent.prototype.ngOnInit = function () {
    };
    SidebarComponent.prototype.doRoute = function (route) {
        this.router.navigate([route]);
    };
    SidebarComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-sidebar',
            template: __webpack_require__(/*! ./sidebar.component.html */ "./src/app/sidebar/sidebar.component.html"),
            styles: [__webpack_require__(/*! ./sidebar.component.css */ "./src/app/sidebar/sidebar.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_authorization_user_service__WEBPACK_IMPORTED_MODULE_2__["UserService"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], SidebarComponent);
    return SidebarComponent;
}());



/***/ }),

/***/ "./src/app/utils/deployment.ts":
/*!*************************************!*\
  !*** ./src/app/utils/deployment.ts ***!
  \*************************************/
/*! exports provided: formatDeploymentVersion */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatDeploymentVersion", function() { return formatDeploymentVersion; });
function formatDeploymentVersion(version, pullRequestMeta) {
    if (pullRequestMeta) {
        return version + "-prid-" + pullRequestMeta.pullId + "/" + pullRequestMeta.issueNumber + " - " + pullRequestMeta.sourceBranch;
    }
    return version;
}


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/lucaalexandru/workspace/terria/hermes-packages/hermes-packages-www/src/main.ts */"./src/main.ts");


/***/ }),

/***/ 1:
/*!********************!*\
  !*** ws (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map