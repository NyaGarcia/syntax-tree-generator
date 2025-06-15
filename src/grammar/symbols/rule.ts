import { GrammarSymbol } from '../interfaces/grammar-symbol.interface';
import { NonTerminal } from './non-terminal';
import { SymbolList } from './symbol-list';

export class Rule {
  constructor(
    private nonTerminal: NonTerminal,
    private symbols: SymbolList,
    private value: String
  ) {}

  getNonTerminal(): NonTerminal {
    return this.nonTerminal;
  }

  getSymbolList(): SymbolList {
    return this.symbols;
  }

  getSymbols(): GrammarSymbol[] {
    return this.symbols.getSymbols();
  }

  contains(symbol: GrammarSymbol): Boolean {
    return this.nonTerminal.equals(symbol) || this.symbols.includes(symbol);
  }

  containsValue(value: String): Boolean {
    return (
      this.nonTerminal.contains(value) || this.symbols.includesValue(value)
    );
  }

  equals(rule: Rule) {
    const { nonTerminal, symbols } = rule;
    return this.nonTerminal.equals(nonTerminal) && this.symbols.equals(symbols);
  }

  getValue() {
    return this.value;
  }

  setNonTerminal(nonTerminal: NonTerminal) {
    this.nonTerminal = nonTerminal;
  }
}
