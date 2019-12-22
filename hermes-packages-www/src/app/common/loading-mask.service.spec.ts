import { TestBed } from '@angular/core/testing';

import { LoadingMaskService } from './loading-mask.service';

describe('LoadingMaskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadingMaskService = TestBed.get(LoadingMaskService);
    expect(service).toBeTruthy();
  });
});
