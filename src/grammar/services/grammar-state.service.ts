import { Injectable } from '@angular/core';
import { Grammar } from '../grammar';

@Injectable({ providedIn: 'root' })
export class GrammarStateService {
  private grammar: Grammar;

  set(grammar: Grammar): void {
    this.grammar = grammar;
  }

  get(): Grammar {
    return this.grammar;
  }
}
