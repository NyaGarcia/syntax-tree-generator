import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { EPSILON } from '../../../app/utils/constants';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
})
export class MultiSelectComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  symbolControl = new FormControl('');
  filteredSymbols: Observable<string[]>;
  symbols: string[] = [];

  @Input() label: string;
  @Input() data: string[];
  @Input() maxLength: number;
  @Input() required: boolean = false;

  @ViewChild('symbolInput') symbolInput: ElementRef<HTMLInputElement>;

  constructor() {}

  get value(): string[] {
    return this.symbols;
  }

  clear() {
    this.symbols = [];
  }

  ngOnChanges() {
    this.filteredSymbols = this.symbolControl.valueChanges.pipe(
      startWith(null),
      map((symbol: string | null) =>
        symbol ? this._filter(symbol) : this.data.slice()
      )
    );

    this.symbols = [
      ...this.symbols.filter((symbol) => this.data.includes(symbol)),
    ];
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || EPSILON).trim();

    if (value && this.canAddMoreSymbols() && this.data.includes(value)) {
      this.symbols = [...this.symbols, value];
    }

    this.clearInputValue(event);

    this.symbolControl.setValue(null);
  }

  remove(symbol: string): void {
    const index = this.symbols.indexOf(symbol);

    if (index >= 0) {
      this.symbols.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const {
      option: { value },
    } = event;

    this.symbolInput.nativeElement.value = '';
    this.symbolControl.setValue(null);

    if (value && this.canAddMoreSymbols()) {
      this.symbols = [...this.symbols, value];
    }
  }

  hasError(): boolean {
    return !this.isValid;
  }

  get isValid(): boolean {
    return !this.required || this.symbols.length > 0;
  }

  canAddMoreSymbols() {
    return !this.maxLength || this.symbols.length < this.maxLength;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.data.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }

  private clearInputValue(event: MatChipInputEvent) {
    event.chipInput!.clear();
  }
}
