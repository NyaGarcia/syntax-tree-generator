import {
  FormattedProductionRule,
  ProductionRule,
} from './interfaces/production-rule.interface';
import { NonTerminal } from './symbols/non-terminal';
import { Rule } from './symbols/rule';
import { SymbolList } from './symbols/symbol-list';
import { Terminal } from './symbols/terminal';

export class Grammar {
  private terminals: Terminal[] = [];
  private nonTerminals: NonTerminal[] = [];
  private rules: Rule[] = [];
  private grammar: ProductionRule[];
  private initialSymbol: NonTerminal;

  public constructor(value: any) {
    this.initGrammar(value);
  }

  public getTerminals() {
    return this.terminals;
  }

  public getNonTerminals() {
    return this.nonTerminals;
  }

  public getRules() {
    return this.rules;
  }

  public getInitialSymbol() {
    return this.initialSymbol;
  }

  private initGrammar(grammar: ProductionRule[]) {
    this.grammar = grammar;

    this.addNonTerminals();

    grammar
      .map((value) => this.formatGrammar(value))
      .map((value) => this.createRule(value));

    this.createNextProductionRules();
    this.addInitialSymbol();
  }

  private createRule(value: FormattedProductionRule) {
    const symbolList = new SymbolList(value.rightProductionRule);
    const ruleValue = `${
      value.leftProductionRule.value
    } -> ${symbolList.toString()}`;
    const rule = new Rule(value.leftProductionRule, symbolList, ruleValue);
    this.rules = [...this.rules, rule];
  }

  private formatGrammar(value: ProductionRule) {
    const rightProductionRule = this.formatRightProductionRule(value);
    const leftProductionRule = new NonTerminal(value.leftProductionRule);
    return { leftProductionRule, rightProductionRule };
  }

  private formatRightProductionRule(value: ProductionRule) {
    const formattedRightProductionRule = [...value.rightProductionRule].map(
      (char) => {
        if (
          this.nonTerminals.some((nonTerminal) => nonTerminal.value === char)
        ) {
          return new NonTerminal(char);
        } else {
          const terminal = new Terminal(char);
          this.addTerminal(terminal);
          return new Terminal(char);
        }
      }
    );

    return formattedRightProductionRule;
  }

  private createNextProductionRules() {
    this.nonTerminals.map((nonTerminal) => {
      const nextProductionRules = this.getNextProductionRules(nonTerminal);
      nonTerminal.setNextProductionRulesIds(nextProductionRules);
    });

    this.nonTerminals.map((nonTerminal) =>
      this.rules.map((rule) => {
        if (rule.getNonTerminal().equals(nonTerminal)) {
          rule.setNonTerminal(nonTerminal);
        }

        this.setSymbolsNextProductionRules(rule, nonTerminal);
      })
    );
  }

  private setSymbolsNextProductionRules(rule: Rule, nonTerminal: NonTerminal) {
    const symbols = rule.getSymbols();
    symbols.forEach((symbol, i) => {
      if(symbol instanceof NonTerminal && symbol.equals(nonTerminal)) {
        symbols[i] = nonTerminal;
      }
    })
  }

  private getNextProductionRules(nonTerminal: NonTerminal) {
    return this.rules.flatMap((rule, index) =>
      rule.getNonTerminal().equals(nonTerminal) ? index : []
    );
  }

  private addNonTerminals() {
    const filteredGrammar = this.filterDuplicates();
    this.nonTerminals = filteredGrammar.map(
      ({ leftProductionRule }) => new NonTerminal(leftProductionRule)
    );
  }

  private addTerminal(terminal: Terminal) {
    this.terminals = [...this.terminals, terminal];
  }

  private addInitialSymbol() {
    this.initialSymbol = this.nonTerminals[0];
  }

  private filterDuplicates() {
    return [
      ...new Map(
        this.grammar.map((rule) => [rule.leftProductionRule, rule])
      ).values(),
    ];
  }
}
