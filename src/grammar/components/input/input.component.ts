import { Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  grammarForm: FormGroup;
  ruleGroup: FormArray;

  @Output() formValue: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.ruleGroup = new FormArray([this.newRuleFormGroup]);

    this.grammarForm = new FormGroup({
      rules: this.ruleGroup,
    });
  }

  emitFormValue() {
    this.formValue.emit(this.grammarForm.get('rules')?.value);
  }

  addRuleInput() {
    this.ruleGroup.push(this.newRuleFormGroup);
  }

  removeRuleInput(index: number) {
    this.ruleGroup.removeAt(index);
  }

  validateGrammar() {
    console.log(this.grammarForm.value);
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

  get ruleGroupControls(): FormGroup[] {
    return this.ruleGroup.controls as FormGroup[];
  }
}
