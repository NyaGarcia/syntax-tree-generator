import { Component } from '@angular/core';
import { GrammarComponent } from '../grammar/components/grammar/grammar.component';
import { TreeComponent } from './tree/components/tree/tree.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GrammarComponent, TreeComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'syntax-tree-generator';
  generateTree = false;

  assignGenerateTree(value: boolean) {
    this.generateTree = value;
  }
}
