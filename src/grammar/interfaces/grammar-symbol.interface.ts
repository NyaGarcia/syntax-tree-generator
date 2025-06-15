export interface GrammarSymbol {
  value: string;

  equals(symbol: GrammarSymbol): boolean;
}
