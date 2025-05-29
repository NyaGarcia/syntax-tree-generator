import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GrammarStateService } from '../services/grammar-state.service';

export const grammarGuard: CanActivateFn = (route, state) => {
  const grammarService = inject(GrammarStateService);
  const router = inject(Router);

  const grammar = grammarService.get();
  if (grammar) {
    return true;
  } else {
    router.navigateByUrl('/');
    return false;
  }
};
