import { Injectable } from '@angular/core';
import { EPSILON } from '../../app/utils/constants';
import {
  UnformattedGrammar,
  ProductionRule,
} from '../interfaces/production-rule.interface';

@Injectable({
  providedIn: 'root',
})
export class GrammarValidatorService {
  constructor() {}

  validate(grammar: any): {
    errors: string[];
    unformattedGrammar?: UnformattedGrammar;
  } {
    const errors: string[] = [];

    console.log(grammar);

    if (
      !grammar ||
      !Array.isArray(grammar.terminals) ||
      !Array.isArray(grammar.nonTerminals) ||
      !Array.isArray(grammar.productionRules)
    ) {
      errors.push(
        'Invalid grammar: terminals, nonTerminals, or productionRules are missing or malformed.'
      );
      return { errors };
    }

    // Step 1: Deduplicate terminals and nonTerminals
    const updatedTerminals = [...new Set<string>(grammar.terminals)];
    const updatedNonTerminals = [...new Set<string>(grammar.nonTerminals)];

    const validSymbols = new Set([
      ...updatedTerminals,
      ...updatedNonTerminals,
      '',
    ]);

    const processedRules: ProductionRule[] = [];
    const seenRules = new Set<string>();

    grammar.productionRules.forEach((rule: any, index: number) => {
      const left = rule.leftProductionRule;

      if (typeof left !== 'string' || left.trim() === '') {
        errors.push(
          `Rule ${index}: leftProductionRule must be a non-empty string.`
        );
        return;
      }

      if (!updatedNonTerminals.includes(left)) {
        errors.push(
          `Rule ${index}: leftProductionRule "${left}" is not declared in nonTerminals.`
        );
      }

      if (!Array.isArray(rule.rightProductionRule)) {
        errors.push(`Rule ${index}: rightProductionRule must be an array.`);
        return;
      }

      const updatedRight = rule.rightProductionRule.map((symbol: string) => {
        const replaced = symbol === '' ? EPSILON : symbol;

        if (!validSymbols.has(replaced)) {
          if (replaced === EPSILON && !updatedTerminals.includes(EPSILON)) {
            updatedTerminals.push(EPSILON);
            validSymbols.add(EPSILON);
          } else {
            errors.push(`Rule ${index}: Symbol "${replaced}" is not declared.`);
          }
        }

        return replaced;
      });

      // Check for duplicate rule
      const ruleKey = `${left} → ${updatedRight.join(' ')}`;
      if (!seenRules.has(ruleKey)) {
        processedRules.push({
          leftProductionRule: left,
          rightProductionRule: updatedRight,
        });
        seenRules.add(ruleKey);
      }
    });

    if (errors.length) {
      return { errors };
    }

    return {
      errors: [],
      unformattedGrammar: {
        terminals: updatedTerminals,
        nonTerminals: updatedNonTerminals,
        productionRules: processedRules,
      },
    };
  }
}
