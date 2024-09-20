import { GrammarSymbol } from "./grammar-symbol.interface";

export class Terminal implements GrammarSymbol {
    
    constructor(public value: String) {}
    
    equals(symbol: GrammarSymbol): boolean {
        const {value} = symbol;
        return this.isTerminal(symbol) && value === this.value;
    }

    isTerminal(symbol: GrammarSymbol): boolean {
        return symbol instanceof Terminal;
    }

}