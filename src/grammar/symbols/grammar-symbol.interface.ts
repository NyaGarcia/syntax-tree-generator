export interface GrammarSymbol {
    value: String;

    equals(symbol: GrammarSymbol): boolean;
}