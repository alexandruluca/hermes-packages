import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthenticationModule} from './authorization/authentication.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Api} from './common/api.service';
import {DeploymentModule} from './deployment/deployment.module';
import {DeploymentListComponent} from './deployment/deployment-list/deployment-list.component';
import {LoginGuard} from './authorization/login.guard';
import {ServerStateListComponent} from './server-state/server-state-list/server-state-list.component';
import {ServerStateModule} from './server-state/server-state.module';
import {OverviewComponent} from './overview/overview.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {DeploymentListPullRequestComponent} from './deployment/deployment-list/deployment-list-pr.component';
import {DeploymentListReleaseCandidateComponent} from './deployment/deployment-list/deployment-list-rc.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ProjectListComponent} from './project/project-list/project-list.component';
import {ProjectModule} from './project/project.module';

export function initializeApp(api: Api) {
  return (): Promise<any> => {
    return api.initialize();
  };
}

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const appRoutes: Routes = [
  {path: 'projects', component: ProjectListComponent, canActivate: [LoginGuard]},
  {path: 'deployments/pull-request', component: DeploymentListPullRequestComponent, canActivate: [LoginGuard]},
  {path: 'deployments/release-candidate', component: DeploymentListReleaseCandidateComponent, canActivate: [LoginGuard]},
  {path: 'deployments/:deploymentType', component: DeploymentListComponent, canActivate: [LoginGuard]},
  {path: 'servers', component: ServerStateListComponent, canActivate: [LoginGuard]},
  {path: 'overview', component: OverviewComponent, canActivate: [LoginGuard]},
  {path: '**', redirectTo: '/deployments/pull-request', canActivate: [LoginGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    SidebarComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false}
    ),
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    /* Custom */
    AuthenticationModule,
    DeploymentModule,
    ProjectModule,
    ServerStateModule
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: initializeApp, deps: [Api], multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
