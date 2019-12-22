import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoadingMaskService {
  private subject: Subject<any>;
  private observable: Observable<any>;
  constructor() {
    this.subject = new Subject<any>();
    this.observable = this.subject.asObservable();
  }

  public onStateChange(func: (isVisible: boolean) => any) {
    this.observable.subscribe(func);
  }

  public showLoadingMask() {
    this.subject.next(true);
  }

  public hideLoadingMask() {
    this.subject.next(false);
  }
}
