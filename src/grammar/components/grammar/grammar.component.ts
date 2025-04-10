import { Component, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'app-grammar',
  standalone: true,
  imports: [
    InputComponent,
    HelpDropdownComponent,
    MatButtonModule,
    TerminalsComponent,
  ],
  templateUrl: './grammar.component.html',
  styleUrl: './grammar.component.scss',
})
export class GrammarComponent {
  @Output() grammar = new EventEmitter<Grammar>();
  formValue: any;
  terminals: string[];
  nonTerminals: string[];

  deletedTerminal: string;
  deletedNonTerminal: string;

  constructor(private treeService: TreeService) {}

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
}
