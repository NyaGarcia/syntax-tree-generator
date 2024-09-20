import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GrammarModule } from '../grammar/grammar.module';
import { GrammarComponent } from '../grammar/components/grammar/grammar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GrammarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'syntax-tree-generator';
}
