import { Component } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { HelpDropdownComponent } from '../help-dropdown/help-dropdown.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-grammar',
  standalone: true,
  imports: [ InputComponent, HelpDropdownComponent, FileUploadComponent],
  templateUrl: './grammar.component.html',
  styleUrl: './grammar.component.scss'
})
export class GrammarComponent {

}
