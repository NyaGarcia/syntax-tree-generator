import { GrammarSymbol } from '../../../grammar/interfaces/grammar-symbol.interface';

export interface Node {
  symbol: GrammarSymbol;
  children: Node[];
  parent: Node | null;
}
