import { NonTerminal } from '../symbols/non-terminal';
import { Terminal } from '../symbols/terminal';

export interface UnformattedGrammar {
  terminals: string[];
  nonTerminals: string[];
  productionRules: ProductionRule[];
}

export interface ProductionRule {
  leftProductionRule: string;
  rightProductionRule: string[];
}

export interface FormattedProductionRule {
  leftProductionRule: NonTerminal;
  rightProductionRule: (NonTerminal | Terminal)[];
}
