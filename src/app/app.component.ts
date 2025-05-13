import { Component } from '@angular/core';
import { GrammarComponent } from '../grammar/components/grammar/grammar.component';
import { TreeComponent } from './tree/components/tree/tree.component';
import { CommonModule } from '@angular/common';
import { DarkModeComponent } from './dark-mode/dark-mode.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DarkModeService } from './dark-mode/dark-mode.service';
import { Grammar } from '../grammar/grammar';

import { MatTabsModule } from '@angular/material/tabs';
import { FileUploadComponent } from '../grammar/components/file-upload/file-upload.component';
import { UnformattedGrammar } from '../grammar/interfaces/production-rule.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    GrammarComponent,
    TreeComponent,
    CommonModule,
    DarkModeComponent,
    MatToolbarModule,
    MatTabsModule,
    FileUploadComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'syntax-tree-generator';
  grammar: Grammar;
  loadedGrammar: UnformattedGrammar;
  selectedTabIndex: number = 0;
  displayTree: boolean = false;

  constructor(public darkModeService: DarkModeService) {}

  generateTree(value: Grammar) {
    if (value.getRules().length !== 0) {
      this.grammar = value;
      this.displayTree = true;
    } else {
      this.displayTree = false;
    }
  }

  loadFile(file: File) {
    this.selectedTabIndex = 0;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string)[0];

        console.log(raw);

        const unformattedGrammar: UnformattedGrammar = {
          terminals: raw.terminals ?? [],
          nonTerminals: raw.nonTerminals ?? [],
          productionRules: (raw.productionRules ?? []).map((rule: any) => ({
            leftProductionRule: rule.leftProductionRule?.[0] ?? '',
            rightProductionRule: rule.rightProductionRule ?? [],
          })),
        };

        console.log(unformattedGrammar);

        this.loadedGrammar = unformattedGrammar;
      } catch (err) {
        console.error('Error parsing file as UnformattedGrammar:', err);
      }
    };

    reader.onerror = () => {
      console.error(`Failed to read file: ${file.name}`);
    };

    reader.readAsText(file);
  }
}
