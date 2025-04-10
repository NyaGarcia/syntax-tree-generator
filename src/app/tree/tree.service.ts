import { Injectable } from '@angular/core';
import { Grammar } from '../../grammar/grammar';
import { NonTerminal } from '../../grammar/symbols/non-terminal';
import { Rule } from '../../grammar/symbols/rule';
import { Stack } from '../utils/stack';
import { GrammarSymbol } from '../../grammar/symbols/grammar-symbol.interface';
import { TreeNode } from '../utils/tree-node';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  private grammar: Grammar;
  private currentNode: any;
  private expandableNodes: Stack<TreeNode<GrammarSymbol>>;
  private expandedNodes: Stack<TreeNode<GrammarSymbol>>;

  constructor() {}

  undo() {
    const previousNode = this.expandedNodes.pop()!;
    this.currentNode = previousNode;
  }

  loadGrammar(grammar: Grammar) {
    this.grammar = grammar;
    this.initializeService();
  }

  getCurrentNode() {
    return this.currentNode;
  }

  setCurrentNode(node: any) {
    this.currentNode = node;
  }

  updateTreeStatus(symbols: TreeNode<GrammarSymbol>[]) {
    // Symbols must be reserved before pushed on to the stack
    symbols.reverse().forEach((symbol) => {
      if (symbol.data instanceof NonTerminal) {
        this.expandableNodes.push(symbol);
      }
    });

    console.log(this.expandableNodes);

    this.updateCurrentNode();
  }

  getInitialSymbol() {
    const initialSymbol = this.grammar.getInitialSymbol();
    const nonTerminal = new NonTerminal(initialSymbol.value);
    nonTerminal.setNextProductionRulesIds(
      initialSymbol.getNextProductionRulesIds()
    );
    return nonTerminal;
  }

  getOptions(): Rule[] {
    if (this.currentNode && this.currentNode.data instanceof NonTerminal) {
      const ids = this.currentNode.data.getNextProductionRulesIds();
      return ids.map((id: number) => this.grammar.getRules()[id]);
    }

    console.log(this.currentNode);

    return [];
  }

  clear() {
    this.initializeService();
  }

  private updateCurrentNode() {
    this.expandedNodes.push(this.currentNode);
    //TODO: add if in the last case to not add currentnode = null
    this.currentNode = this.expandableNodes.pop();
    console.log(this.currentNode);
  }

  private initializeService() {
    this.currentNode = null;
    this.expandableNodes = new Stack();
    this.expandedNodes = new Stack();
  }
}
