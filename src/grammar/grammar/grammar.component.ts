import { Component } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { HelpDropdownComponent } from '../help-dropdown/help-dropdown.component';

@Component({
  selector: 'app-grammar',
  standalone: true,
  imports: [ InputComponent, HelpDropdownComponent],
  templateUrl: './grammar.component.html',
  styleUrl: './grammar.component.scss'
})
export class GrammarComponent {

}
