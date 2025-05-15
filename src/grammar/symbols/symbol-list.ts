import { GrammarSymbol } from './grammar-symbol.interface';

export class SymbolList {
  constructor(private symbols: GrammarSymbol[]) {}

  equals(symbolList: SymbolList) {
    this.symbols.length === symbolList.length &&
      this.symbols.every((symbol, i) =>
        symbol.equals(symbolList.getSymbols()[i])
      );
  }

  get length() {
    return this.symbols.length;
  }

  getSymbols() {
    return this.symbols;
  }

  includes(symbol: GrammarSymbol) {
    return this.symbols.includes(symbol);
  }

  includesValue(value: String) {
    return this.symbols.some(({ value }) => value === value);
  }

  toString() {
    return this.symbols.reduce((acc, symbol) => (acc += symbol.value), '');
  }
}
