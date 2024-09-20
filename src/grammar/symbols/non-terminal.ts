import { GrammarSymbol } from "./grammar-symbol.interface";

export class NonTerminal implements GrammarSymbol {
    
    constructor(public value: String) {}
    
    equals(symbol: GrammarSymbol): boolean {
        const {value} = symbol;
        return this.isNonTerminal(symbol) && value === this.value;
    }

    isNonTerminal(symbol: GrammarSymbol): boolean {
        return symbol instanceof NonTerminal;
    }

}