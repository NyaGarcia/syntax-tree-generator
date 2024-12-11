import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rule } from '../../../../grammar/symbols/rule';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsComponent {
  @Input() options: Rule[];
  @Output() optionEmitter = new EventEmitter<Rule>();

  selectOption(option: Rule) {
    this.optionEmitter.emit(option);
  }

}
