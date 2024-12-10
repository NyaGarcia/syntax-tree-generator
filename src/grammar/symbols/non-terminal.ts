import { GrammarSymbol } from "./grammar-symbol.interface";

export class NonTerminal implements GrammarSymbol {
    private nextProductionRulesIds: number[];
    public type = "NonTerminal";
    
    constructor(public value: String) {}
    
    equals(symbol: GrammarSymbol): boolean {
        const {value} = symbol;
        return this.isNonTerminal(symbol) && value === this.value;
    }

    isNonTerminal(symbol: GrammarSymbol): boolean {
        return symbol instanceof NonTerminal;
    }

    contains(value: String) {
        return this.value === value;
    }

    setNextProductionRulesIds(rules: number[]) {
        this.nextProductionRulesIds = rules;
    }

    getNextProductionRulesIds() {
        return this.nextProductionRulesIds;
    }

}