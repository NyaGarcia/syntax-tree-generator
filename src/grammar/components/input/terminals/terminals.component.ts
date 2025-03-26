import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-terminals',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './terminals.component.html',
  styleUrl: './terminals.component.scss',
})
export class TerminalsComponent {
  terminalForm: FormGroup;
  symbols: string[] = [];

  @Output() formValue: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() deletedSymbol: EventEmitter<string> = new EventEmitter<string>();
  @Input() symbolType: string;
  @Input() symbolLength: number;

  ngOnInit() {
    this.terminalForm = new FormGroup({
      symbol: new FormControl(''),
    });
  }

  removeTerminal(index: number) {
    const symbol = this.symbols[index];
    this.symbols = this.symbols.filter((_, i) => i !== index);
    this.formValue.emit(this.symbols);
    this.deletedSymbol.emit(symbol);
  }

  addTerminal() {
    const value = this.terminalForm.get('symbol')?.value;
    this.symbols = [...this.symbols, value];
    this.formValue.emit(this.symbols);
  }

  get symbol() {
    return this.terminalForm.get('symbol');
  }
}
