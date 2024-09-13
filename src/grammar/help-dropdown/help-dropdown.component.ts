import { Component } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-help-dropdown',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './help-dropdown.component.html',
  styleUrl: './help-dropdown.component.scss'
})
export class HelpDropdownComponent {

}
