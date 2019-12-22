import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {Observable, ObservableInput} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Config {
  private http: HttpClient;
  public locationOrigin: string;
  public apiUrl: string;
  public googleApiClientId: string;

  constructor(http: HttpClient) {
    this.http = http;
    this.locationOrigin = location.origin.includes('localhost') ? 'http://localhost:8090' : location.origin;
    this.apiUrl = `${this.locationOrigin}/api/api-docs`;
  }

  async initialize() {
    this.http.get(`${this.locationOrigin}/api/config`).toPromise().then(({googleApiClientId}: any) => {
      this.googleApiClientId = googleApiClientId;
    });
  }
}
