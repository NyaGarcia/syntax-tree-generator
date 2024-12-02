import { Component, EventEmitter, Output } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { HelpDropdownComponent } from '../help-dropdown/help-dropdown.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { MatButtonModule } from '@angular/material/button';
import { Grammar } from '../../grammar';
import { TreeService } from '../../../app/tree/tree.service';

@Component({
  selector: 'app-grammar',
  standalone: true,
  imports: [ InputComponent, HelpDropdownComponent, FileUploadComponent, MatButtonModule],
  templateUrl: './grammar.component.html',
  styleUrl: './grammar.component.scss'
})
export class GrammarComponent {
  @Output() generateTree = new EventEmitter<boolean>();
  formValue: any;

  constructor(private treeService: TreeService) {}

  onFormEvent(formValue: any) {
    this.formValue = formValue;
    const grammar = new Grammar(formValue);
    this.treeService.loadGrammar(grammar);
    this.generateTree.emit(true);
  }

  
}
