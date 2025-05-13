import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { HelpDropdownComponent } from '../help-dropdown/help-dropdown.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { MatButtonModule } from '@angular/material/button';
import { Grammar } from '../../grammar';
import { TreeService } from '../../../app/tree/tree.service';
import { TerminalsComponent } from '../input/terminals/terminals.component';
import {
  ProductionRule,
  UnformattedGrammar,
} from '../../interfaces/production-rule.interface';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grammar',
  standalone: true,
  imports: [
    InputComponent,
    HelpDropdownComponent,
    MatButtonModule,
    TerminalsComponent,
    MatIconModule,
  ],
  templateUrl: './grammar.component.html',
  styleUrl: './grammar.component.scss',
})
export class GrammarComponent {
  @Input() loadedGrammar: UnformattedGrammar;
  @Output() grammar = new EventEmitter<Grammar>();
  formValue: any;
  terminals: string[] = [];
  nonTerminals: string[] = [];

  loadedProductionRules: ProductionRule[];

  deletedTerminal: string;
  deletedNonTerminal: string;

  constructor() {}

  ngOnChanges() {
    if (this.loadedGrammar) {
      this.loadData();
    }
  }

  onFormEvent(formValue: UnformattedGrammar) {
    this.formValue = formValue;
    const grammar = new Grammar(formValue);
    //this.treeService.loadGrammar(grammar);
    this.grammar.emit(grammar);
  }

  onTerminalFormEvent(terminals: string[]) {
    this.terminals = [...terminals];
  }

  onNonTerminalFormEvent(nonTerminals: string[]) {
    this.nonTerminals = [...nonTerminals];
  }

  onDeletedTerminalEvent(terminal: string) {
    this.deletedTerminal = terminal;
  }

  onDeletedNonTerminalEvent(nonTerminal: string) {
    this.deletedNonTerminal = nonTerminal;
  }

  clear() {
    this.terminals = [];
    this.nonTerminals = [];
    this.loadedProductionRules = [];
  }

  loadGrammar() {
    this.nonTerminals = ['A', 'B', 'C'];
    this.terminals = ['a', 'b', 'c', 'ε'];
    this.loadedProductionRules = [
      {
        leftProductionRule: 'A',
        rightProductionRule: ['a', 'B'],
      },
      {
        leftProductionRule: 'A',
        rightProductionRule: ['ε'],
      },
      {
        leftProductionRule: 'B',
        rightProductionRule: ['b', 'A'],
      },
      {
        leftProductionRule: 'B',
        rightProductionRule: ['C'],
      },
      {
        leftProductionRule: 'C',
        rightProductionRule: ['c', 'C'],
      },
      {
        leftProductionRule: 'C',
        rightProductionRule: ['ε'],
      },
    ];
  }

  private loadData() {
    const { terminals, nonTerminals, productionRules } = this.loadedGrammar;

    this.terminals = terminals;
    this.nonTerminals = nonTerminals;
    this.loadedProductionRules = productionRules;

    if (!this.terminals.includes('ε')) {
      this.terminals = [...this.terminals, 'ε'];
    }

    console.log(this.terminals);
  }
}
