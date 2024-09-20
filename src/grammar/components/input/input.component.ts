import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-input',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatButtonModule, CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  grammarForm: FormGroup;
  ruleGroup: FormArray;
  grammar: FormControl = new FormControl("", [Validators.required, Validators.pattern(/^(\s*[A-Z]\s*->\s*[a-zA-Z]+\s*(\|\s*[a-zA-Z]+)*)+$/g)]);

  constructor(private formBuilder: FormBuilder) {
    this.ruleGroup = new FormArray([this.newRuleFormGroup]);

    this.grammarForm = new FormGroup({
      rules: this.ruleGroup
    });
  }

  addRuleInput() {
    this.ruleGroup.push(this.newRuleFormGroup);
  }

  removeRuleInput(index: number) {
    this.ruleGroup.removeAt(index);
  }

  public validateGrammar():void {
    const grammarValue: String = this.grammar.value;
    console.log(grammarValue);
  }

  get newRuleFormGroup():FormGroup {
    return new FormGroup({
      leftProductionRule: new FormControl("", [Validators.required]),
      rightProductionRule: new FormControl("", [Validators.required])
    });
  }

  get ruleGroupControls(): FormGroup[] {
    return this.ruleGroup.controls as FormGroup[];
  }

}
