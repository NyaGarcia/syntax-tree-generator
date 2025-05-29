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
import { SampleFileService } from '../../services/sample-file.service';
import { Router } from '@angular/router';
import { GrammarStateService } from '../../services/grammar-state.service';

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

  formValue: any;
  terminals: string[] = [];
  nonTerminals: string[] = [];

  loadedProductionRules: ProductionRule[];

  deletedTerminal: string;
  deletedNonTerminal: string;

  constructor(
    private sampleFileService: SampleFileService,
    private router: Router,
    private grammarState: GrammarStateService
  ) {}

  ngOnChanges() {
    if (this.loadedGrammar) {
      this.loadData();
    }
  }

  onFormEvent(formValue: UnformattedGrammar) {
    this.formValue = formValue;
    this.navigateToTree(formValue);
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
    const { terminals, nonTerminals, productionRules } =
      this.sampleFileService.getGrammar();
    this.nonTerminals = nonTerminals;
    this.terminals = terminals;
    this.loadedProductionRules = productionRules;
  }

  private loadData() {
    const { terminals, nonTerminals, productionRules } = this.loadedGrammar;

    this.terminals = terminals;
    this.nonTerminals = nonTerminals;
    this.loadedProductionRules = productionRules;

    if (!this.terminals.includes('ε')) {
      this.terminals = [...this.terminals, 'ε'];
    }
  }

  private navigateToTree(value: UnformattedGrammar) {
    const grammar = new Grammar(value);

    this.grammarState.set(grammar);
    this.router.navigateByUrl('/tree');
  }
}
