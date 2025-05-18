import { TestBed } from '@angular/core/testing';

import { GrammarValidatorService } from './grammar-validator.service';

describe('GrammarValidatorService', () => {
  let service: GrammarValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrammarValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
