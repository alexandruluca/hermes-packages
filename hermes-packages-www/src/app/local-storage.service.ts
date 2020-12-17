import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private prefix = 'hermes-packages';
  constructor() {
  }

  getItem(key) {
    key = `${this.prefix}.${key}`;

    let val = localStorage.getItem(key);

    if (val) {
      try {
        val = JSON.parse(val);
      } catch (err) {
        // no op
      }
    }

    const parseIntVal: any = parseInt(val, 10);

    // tslint:disable-next-line:triple-equals
    if (parseIntVal == val) {
      return parseIntVal;
    }

    if (val === 'true') {
      return true;
    } else if (val === 'false') {
      return false;
    }

    return val;
  }

  setItem(key, value) {
    key = `${this.prefix}.${key}`;

    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  }

  removeItem(key) {
    key = `${this.prefix}.${key}`;

    localStorage.removeItem(key);
  }
}
