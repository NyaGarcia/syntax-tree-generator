import { TestBed } from '@angular/core/testing';

import { GrammarStateService } from './grammar-state.service';

describe('GrammarStateService', () => {
  let service: GrammarStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrammarStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
