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
        'Gramática inválida: faltan símbolos terminales, no terminales o reglas de producción o tienen un formato incorrecto.'
      );
      return { errors };
    }

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

      if (!Array.isArray(rule.rightProductionRule)) {
        errors.push(
          `Error en la regla nº ${index}: el campo \'rightProductionRule\' debe ser un array.`
        );
        return;
      }

      if (!Array.isArray(rule.leftProductionRule)) {
        errors.push(
          `Error en la regla nº ${index}: el campo \'leftProductionRule\' debe ser un array.`
        );
        return;
      }

      if (typeof left !== 'string' || left.trim() === '') {
        errors.push(
          `Error en la regla nº ${index}: el campo \'leftProductionRule\' debe ser de tipo string, y no puede estar vacío.`
        );
        return;
      }

      if (!updatedNonTerminals.includes(left)) {
        errors.push(
          `Error en la regla nº ${index}: en el campo \'leftProductionRule\', el símbolo "${left}" no está declarado en el campo \'nonTerminals\'.`
        );
      }

      const updatedRight = rule.rightProductionRule.map((symbol: string) => {
        const replaced = symbol === '' ? EPSILON : symbol;

        if (!validSymbols.has(replaced)) {
          if (replaced === EPSILON && !updatedTerminals.includes(EPSILON)) {
            updatedTerminals.push(EPSILON);
            validSymbols.add(EPSILON);
          } else {
            errors.push(
              `Error en la regla nº ${index}: El símbolo "${replaced}" no ha sido declarado.`
            );
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
