import { NonTerminal } from "../symbols/non-terminal";
import { SymbolList } from "../symbols/symbol-list";
import { Terminal } from "../symbols/terminal";

export interface ProductionRule {
    leftProductionRule: string;
    rightProductionRule: string;
}

export interface FormattedProductionRule {
    leftProductionRule: NonTerminal;
    rightProductionRule: (NonTerminal | Terminal)[];
}