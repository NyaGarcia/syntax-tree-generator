import { Component, inject } from '@angular/core';
import { GrammarComponent } from '../grammar/components/grammar/grammar.component';
import { TreeComponent } from './tree/components/tree/tree.component';
import { CommonModule } from '@angular/common';
import { DarkModeComponent } from './dark-mode/dark-mode.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DarkModeService } from './dark-mode/dark-mode.service';
import { Grammar } from '../grammar/grammar';

import { MatTabsModule } from '@angular/material/tabs';
import { FileUploadComponent } from '../grammar/components/file-upload/file-upload.component';
import {
  ProductionRule,
  UnformattedGrammar,
} from '../grammar/interfaces/production-rule.interface';
import { EPSILON } from './utils/constants';
import { GrammarValidatorService } from '../grammar/services/grammar-validator.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../grammar/components/error-modal/error-modal.component';

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

  validationErrors: string[] = [];
  dialog = inject(MatDialog);

  darkMode = this.darkModeService.darkModeSignal();

  constructor(
    public darkModeService: DarkModeService,
    private grammarValidatorService: GrammarValidatorService
  ) {}

  generateTree(value: Grammar) {
    if (value.getRules().length !== 0) {
      this.grammar = value;
      this.displayTree = true;
    } else {
      this.displayTree = false;
    }
  }

  loadFile(file: File) {
    this.displayTree = false;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string)[0];

        console.log(raw);

        /* const unformattedGrammar: UnformattedGrammar = {
          terminals: raw.terminals ?? [],
          nonTerminals: raw.nonTerminals ?? [],
          productionRules: (raw.productionRules ?? []).map((rule: any) => ({
            leftProductionRule: rule.leftProductionRule ?? '',
            rightProductionRule: rule.rightProductionRule ?? [],
          })),
        }; */

        const validationResult: any =
          this.grammarValidatorService.validate(raw);

        console.log(validationResult);

        if (validationResult.errors.length > 0) {
          this.validationErrors = validationResult.errors;
          this.displayDialog(this.validationErrors);
        } else {
          this.selectedTabIndex = 0;
          this.loadedGrammar = validationResult.unformattedGrammar;
        }
      } catch (err) {
        console.error('Error parsing file as UnformattedGrammar:', err);
      }
    };

    reader.onerror = () => {
      console.error(`Failed to read file: ${file.name}`);
    };

    reader.readAsText(file);
  }

  private displayDialog(errors: string[]) {
    this.dialog.open(ErrorModalComponent, {
      data: {
        errors,
      },
    });
  }
}
