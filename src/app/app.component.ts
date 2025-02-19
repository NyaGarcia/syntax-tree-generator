import { Component } from '@angular/core';
import { GrammarComponent } from '../grammar/components/grammar/grammar.component';
import { TreeComponent } from './tree/components/tree/tree.component';
import { CommonModule } from '@angular/common';
import { DarkModeComponent } from './dark-mode/dark-mode.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DarkModeService } from './dark-mode/dark-mode.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    GrammarComponent,
    TreeComponent,
    CommonModule,
    DarkModeComponent,
    MatToolbarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'syntax-tree-generator';
  generateTree = false;

  constructor(public darkModeService: DarkModeService) {}

  assignGenerateTree(value: boolean) {
    this.generateTree = value;
  }
}
