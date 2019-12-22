import {Injectable} from '@angular/core';
import Swagger from 'swagger-client/browser';
import {LoadingMaskService} from './loading-mask.service';
import {Config} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class Api {
  public clientInstance: Swagger;
  private loadinMaskService: LoadingMaskService;
  private config: Config;
  private requestInterceptors: ((req: any) => any)[] = [];
  private responseInterceptors: ((req: any) => any)[] = [];
  userApi: UserApi;

  constructor(loadinMaskService: LoadingMaskService, config: Config) {
    this.loadinMaskService = loadinMaskService;
    this.config = config;

    this.requestInterceptors.push(req => {
      this.loadinMaskService.showLoadingMask();
      return req;
    });

    this.responseInterceptors.push(res => {
      this.loadinMaskService.hideLoadingMask();

      if (res.ok === false && res.body && res.body.message) {
        res.statusText = res.body.message;
        return res;
      }

      return res;
    });
  }

  setRequestInterceptor(reqInterceptor: (req: any) => any) {
    this.requestInterceptors.push(reqInterceptor);
  }

  setResponseInterceptor(resInterceptor: (req: any) => any) {
    this.responseInterceptors.push(resInterceptor);
  }

  async initialize() {
    await this.config.initialize();


    let spec = await fetch(this.config.apiUrl).then(r => r.json());

    spec.schemes = [
      location.protocol.startsWith('https') ? 'https' : 'http'
    ];

    this.clientInstance = await Swagger({
      url: this.config.apiUrl,
      spec,
      requestInterceptor: (req) => {
        req.headers['content-type'] = 'application/json';

        return this.requestInterceptors.reduce((request, interceptor) => {
          request = interceptor(request);
          return request;
        }, req);
      },
      responseInterceptor: (res) => {
        return this.responseInterceptors.reduce((response, interceptor) => {
          response = interceptor(response);
          return response;
        }, res);
      },
    });

    // override apis and use ZoneAware promise for the result
    for (const apiKey in this.clientInstance.apis) {
      const api = this.clientInstance.apis[apiKey];

      for (const apiMethodKey in api) {
        const fn = api[apiMethodKey];

        api[apiMethodKey] = function() {
          return Promise.resolve(fn.apply(api, arguments).then(function(res) {
            if (res.obj && res.obj.data) {
              return res.obj.data;
            }
            return res;
          }));
        };
      }
    }

    this.userApi = new UserApi(this.clientInstance);
  }
}

class UserApi {
  private clientInstance: Swagger;
  constructor(clientInstance: Swagger) {
    this.clientInstance = clientInstance;
  }
  async login(email, accessToken): Promise<void> {
    return this.clientInstance.apis.user.login({
      email,
      accessToken,
      payload: {
        accessToken
      }
    });
  }
}
