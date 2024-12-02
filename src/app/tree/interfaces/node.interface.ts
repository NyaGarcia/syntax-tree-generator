import { GrammarSymbol } from "../../../grammar/symbols/grammar-symbol.interface";


export interface Node {
    symbol: GrammarSymbol;
    children: Node[];
    parent: Node | null;
}
