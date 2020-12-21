import { TestBed, async, inject } from '@angular/core/testing';

import { NoAuthuserGuard } from './no-authuser.guard';

describe('NoAuthuserGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoAuthuserGuard]
    });
  });

  it('should ...', inject([NoAuthuserGuard], (guard: NoAuthuserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
