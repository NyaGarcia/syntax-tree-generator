import { Injectable } from '@angular/core';
import { Grammar } from '../../grammar/grammar';
import { NonTerminal } from '../../grammar/symbols/non-terminal';
import { Rule } from '../../grammar/symbols/rule';
import { Stack } from '../utils/stack';
import { GrammarSymbol } from '../../grammar/symbols/grammar-symbol.interface';
import { TreeNode } from '../utils/tree-node';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  private grammar: Grammar;
  private currentNode: any;
  private expandableNodes: Stack<TreeNode<GrammarSymbol>>;

  constructor() {}

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
    symbols.reverse().forEach(symbol => {
      
      if(symbol.data instanceof NonTerminal) {
        this.expandableNodes.push(symbol);
      }
    });

    this.updateCurrentNode();
  }

  getInitialSymbol() {
    const initialSymbol = this.grammar.getInitialSymbol();
    const nonTerminal = new NonTerminal(initialSymbol.value);
    nonTerminal.setNextProductionRulesIds(initialSymbol.getNextProductionRulesIds());
    return nonTerminal;
  }

  getOptions(): Rule[] {
    if(this.currentNode && this.currentNode.data instanceof NonTerminal) {
      const ids = this.currentNode.data.getNextProductionRulesIds();
      return ids.map((id: number) => this.grammar.getRules()[id]);
    }

    return [];
    
  }

  clear() {
    this.initializeService();
  }

  private updateCurrentNode() {
    this.currentNode = this.expandableNodes.pop();
  }

  private initializeService() {
    this.currentNode = null;
    this.expandableNodes = new Stack();
  }
}
