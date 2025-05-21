import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {
  ProductionRule,
  UnformattedGrammar,
} from '../../interfaces/production-rule.interface';
import { MultiSelectComponent } from '../multi-select/multi-select.component';
import { EPSILON } from '../../../app/utils/constants';

interface IDropdownItem {
  id: string;
  text: string;
}

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    NgMultiSelectDropDownModule,
    MultiSelectComponent,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  private firstEmission = true;

  dropdownSymbols: string[] = [];
  dropdownNonTerminals: string[] = [];

  @Input() terminals: string[];
  @Input() nonTerminals: string[];

  @Input() loadedProductionRules: ProductionRule[];

  @Input() deletedTerminal: string;
  @Input() deletedNonTerminal: string;

  productionRules: ProductionRule[] = [];

  @Output() formValue: EventEmitter<UnformattedGrammar> =
    new EventEmitter<UnformattedGrammar>();

  @ViewChildren('focusInput') focusInput: QueryList<ElementRef>;
  @ViewChild('leftProductionRule') leftProductionRule: MultiSelectComponent;
  @ViewChild('rightProductionRule') rightProductionRule: MultiSelectComponent;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.updateRules();
    this.updateSymbols();
  }

  private updateSymbols() {
    if (this.nonTerminals) {
      this.dropdownNonTerminals = this.nonTerminals;
    }

    if (this.terminals) {
      this.dropdownSymbols = [...this.terminals, ...this.dropdownNonTerminals];
    }
  }

  private updateRules() {
    if (this.loadedProductionRules && this.loadedProductionRules.length > 0) {
      this.productionRules = [...this.loadedProductionRules];
      this.loadedProductionRules = [];
    }

    if (this.deletedTerminal || this.deletedNonTerminal) {
      this.productionRules.map((rule) => this.purgeRule(rule));

      this.clearDeletedSymbol();

      if (!this.firstEmission) {
        this.emitGrammar();
      }
    }
  }

  private purgeRule(rule: ProductionRule) {
    const { leftProductionRule, rightProductionRule } = rule;
    const combinedRule = [...rightProductionRule, leftProductionRule];

    if (
      combinedRule.includes(this.deletedTerminal) ||
      combinedRule.includes(this.deletedNonTerminal)
    ) {
      this.productionRules = this.productionRules.filter(
        (productionRule) => productionRule !== rule
      );
    }
  }

  submit() {
    this.emitGrammar();
    this.firstEmission = false;
  }

  validateRule() {
    if (!this.leftProductionRule.hasError()) {
      this.addRuleInput();
    }
  }

  addRuleInput() {
    const leftProductionRule = this.leftProductionRule.value[0];
    const rightProductionRule = this.formatRightProductionRule();

    this.productionRules = [
      ...this.productionRules,
      { leftProductionRule, rightProductionRule },
    ];

    this.clearProductionRules();

    if (!this.firstEmission) {
      this.emitGrammar();
    }
  }

  removeRuleInput(index: number) {
    this.productionRules = this.productionRules.filter((_, i) => i !== index);

    if (!this.firstEmission) {
      this.emitGrammar();
    }
  }

  get newRuleFormGroup(): FormGroup {
    return new FormGroup({
      leftProductionRule: new FormControl('', [
        Validators.required,
        Validators.pattern('[A-Z]'),
      ]),
      rightProductionRule: new FormControl('', [Validators.pattern('^.*$')]),
    });
  }

  downloadGrammar() {
    const grammar = [
      {
        terminals: this.terminals,
        nonTerminals: this.nonTerminals,
        productionRules: this.productionRules,
      },
    ];

    const grammarString = JSON.stringify(grammar);
    const blob = new Blob([grammarString], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'grammar.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  private formatRightProductionRule() {
    return this.rightProductionRule.value.length === 0
      ? [EPSILON]
      : this.rightProductionRule.value;
  }

  private emitGrammar() {
    const unformattedGrammar = {
      terminals: this.terminals,
      nonTerminals: this.nonTerminals,
      productionRules: this.productionRules,
    };

    this.formValue.emit(unformattedGrammar);
  }

  private clearProductionRules() {
    this.leftProductionRule.clear();
    this.rightProductionRule.clear();
  }

  private clearDeletedSymbol() {
    this.deletedTerminal = '';
    this.deletedNonTerminal = '';
  }
}
