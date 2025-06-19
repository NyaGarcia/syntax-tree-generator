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
import { SampleFileService } from '../../services/sample-file.service';

interface GrammarValidationResult {
  valid: boolean;
  errors: string[];
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

  @Input() loadedProductionRules: ProductionRule[] | null;

  @Input() deletedTerminal: string;
  @Input() deletedNonTerminal: string;

  productionRules: ProductionRule[] = [];
  validationErrors: string[] = [];

  @Output() formValue: EventEmitter<UnformattedGrammar> =
    new EventEmitter<UnformattedGrammar>();

  @ViewChild('leftProductionRule') leftProductionRule: MultiSelectComponent;
  @ViewChild('rightProductionRule') rightProductionRule: MultiSelectComponent;

  constructor(private sampleFileService: SampleFileService) {}

  ngOnInit() {}

  ngOnChanges() {
    this.updateRules();
    this.updateSymbols();
  }

  validateGrammar(): GrammarValidationResult {
    const errors: string[] = [];

    if (!this.nonTerminals || this.nonTerminals.length === 0) {
      errors.push('No se ha definido ningún no terminal');
    }

    if (!this.productionRules || this.productionRules.length === 0) {
      errors.push('No se ha definido ninguna regla de producción');
    }

    const lhsSet = new Set(
      this.productionRules.map((rule) => rule.leftProductionRule)
    );
    const rhsSymbols = new Set<string>();

    for (const rule of this.productionRules) {
      for (const symbol of rule.rightProductionRule) {
        if (this.nonTerminals.includes(symbol)) {
          rhsSymbols.add(symbol);
        }
      }
    }

    for (const symbol of rhsSymbols) {
      if (!lhsSet.has(symbol)) {
        errors.push(`El no terminal "${symbol}" no se puede derivar`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
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
    if (this.loadedProductionRules) {
      this.productionRules = [...this.loadedProductionRules];
      this.loadedProductionRules = null;
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
    const { errors, valid } = this.validateGrammar();

    this.validationErrors = errors;

    if (valid) {
      this.emitGrammar();
      this.firstEmission = false;
    }
  }

  validateRule() {
    if (!this.leftProductionRule.hasError()) {
      this.addRuleInput();
    }
  }

  addRuleInput() {
    const leftProductionRule = this.leftProductionRule.value[0];
    const rightProductionRule = this.formatRightProductionRule();

    const ruleExists = this.productionRules.some(
      (rule) =>
        rule.leftProductionRule === leftProductionRule &&
        JSON.stringify(rule.rightProductionRule) ===
          JSON.stringify(rightProductionRule)
    );

    if (!ruleExists) {
      this.productionRules = [
        ...this.productionRules,
        { leftProductionRule, rightProductionRule },
      ];

      this.clearProductionRules();

      if (!this.firstEmission) {
        this.emitGrammar();
      }
    }
  }

  removeRuleInput(index: number) {
    this.productionRules = this.productionRules.filter((_, i) => i !== index);

    if (!this.firstEmission) {
      this.emitGrammar();
    }
  }

  downloadGrammar() {
    const grammar = {
      terminals: this.terminals,
      nonTerminals: this.nonTerminals,
      productionRules: this.productionRules,
    };

    this.sampleFileService.downloadGrammarFile(grammar);
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
