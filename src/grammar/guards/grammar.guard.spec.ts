import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { grammarGuard } from './grammar.guard';

describe('grammarGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => grammarGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
