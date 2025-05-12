import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
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
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  private firstEmission = true;

  dropdownSymbols: IDropdownItem[] = [];
  dropdownNonTerminals: IDropdownItem[] = [];

  @Input() terminals: string[];
  @Input() nonTerminals: string[] = [];

  @Input() loadedProductionRules: ProductionRule[];

  @Input() deletedTerminal: string;
  @Input() deletedNonTerminal: string;

  rightProductionRule: IDropdownItem[];
  rightProductionRuleDropdownSettings: IDropdownSettings;

  leftProductionRule: IDropdownItem[];
  leftProductionRuleDropdownSettings: IDropdownSettings;

  productionRules: ProductionRule[] = [];

  //nextRuleId: number = 0;

  @Output() formValue: EventEmitter<UnformattedGrammar> =
    new EventEmitter<UnformattedGrammar>();

  @ViewChildren('focusInput') focusInput: QueryList<ElementRef>;

  constructor() {}

  ngOnInit() {
    this.leftProductionRuleDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.rightProductionRuleDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  private formatSymbols() {
    return this.terminals.map((symbol) => ({
      id: crypto.randomUUID(),
      text: symbol,
    }));
  }

  ngOnChanges() {
    this.updateRules();
    this.updateSymbols();
  }

  /*   ngAfterViewInit() {
    this.focusInput.changes.subscribe((list: QueryList<ElementRef>) =>
      this.focusNextInput(list)
    );
  } */

  private updateSymbols() {
    if (this.nonTerminals) {
      this.dropdownNonTerminals = this.nonTerminals.map((nonTerminal) => ({
        id: crypto.randomUUID(),
        text: nonTerminal,
      }));
    }

    if (this.terminals) {
      this.dropdownSymbols = [
        ...this.dropdownSymbols,
        ...this.formatSymbols(),
        ...this.dropdownNonTerminals,
      ];
    }
  }

  private updateRules() {
    if (this.loadedProductionRules) {
      this.productionRules = this.loadedProductionRules;
    }

    if (this.deletedTerminal || this.deletedNonTerminal) {
      this.productionRules.map((rule) => this.purgeRule(rule));
      this.emitGrammar();
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

  addRuleInput() {
    const leftProductionRule = this.leftProductionRule[0].text;
    const rightProductionRule = this.rightProductionRule.map(
      (item) => item.text
    );

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
    this.emitGrammar();
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

  private emitGrammar() {
    const unformattedGrammar = {
      terminals: this.terminals,
      nonTerminals: this.nonTerminals,
      productionRules: this.productionRules,
    };

    this.formValue.emit(unformattedGrammar);
  }

  private clearProductionRules() {
    this.leftProductionRule = [];
    this.rightProductionRule = [];
  }

  /*   private focusNextInput(list: QueryList<ElementRef>) {
    list.toArray()[this.nextRuleId].nativeElement.focus();
    this.cdRef.detectChanges();
  } */
}
