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
import { ShowErrorOnDirtyStateMatcher } from '../../../matchers/error-state.matcher';
import { EPSILON } from '../../../../app/utils/constants';

@Component({
  selector: 'app-symbols',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './symbols.component.html',
  styleUrl: './symbols.component.scss',
})
export class SymbolsComponent {
  @Input() symbols: string[];

  terminalForm: FormGroup;
  matcher = new ShowErrorOnDirtyStateMatcher();

  @Output() formValue: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() deletedSymbol: EventEmitter<string> = new EventEmitter<string>();
  @Input() symbolType: string;
  @Input() placeholder: string;
  @Input() required: boolean = false;

  ngOnInit() {
    this.terminalForm = new FormGroup({
      symbol: new FormControl(''),
    });

    if (this.required) {
      this.terminalForm.get('symbol')?.setValidators([Validators.required]);
    }
  }

  removeTerminal(index: number) {
    const symbol = this.symbols[index];
    this.symbols = this.symbols.filter((_, i) => i !== index);
    this.formValue.emit(this.symbols);
    this.deletedSymbol.emit(symbol);
  }

  checkFormValidity() {
    if (this.terminalForm.valid) {
      this.addTerminal();
    }
  }

  addTerminal() {
    const value = this.terminalForm.get('symbol')?.value || EPSILON;

    if (!this.symbols.includes(value)) {
      this.symbols = [...this.symbols, value];
      this.formValue.emit(this.symbols);
    }
  }

  get symbol() {
    return this.terminalForm.get('symbol');
  }
}
