import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../../../grammar/components/error-modal/error-modal.component';
import { Grammar } from '../../../grammar/grammar';
import { UnformattedGrammar } from '../../../grammar/interfaces/production-rule.interface';
import { GrammarValidatorService } from '../../../grammar/services/grammar-validator.service';
import { DarkModeService } from '../../dark-mode/dark-mode.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { FileUploadComponent } from '../../../grammar/components/file-upload/file-upload.component';
import { GrammarComponent } from '../../../grammar/components/grammar/grammar.component';
import { GrammarStateService } from '../../../grammar/services/grammar-state.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [GrammarComponent, CommonModule, MatTabsModule, FileUploadComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  grammar: Grammar;
  loadedGrammar: UnformattedGrammar;
  selectedTabIndex: number = 0;

  validationErrors: string[] = [];
  dialog = inject(MatDialog);

  constructor(
    public darkModeService: DarkModeService,
    private grammarValidatorService: GrammarValidatorService,
    private grammarState: GrammarStateService
  ) {}

  ngOnInit() {
    const grammar = this.grammarState.get();

    if (grammar) {
      this.loadedGrammar = grammar.getUnformattedGrammar();
    }
  }

  loadFile(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string) as UnformattedGrammar;

        const validationResult: any =
          this.grammarValidatorService.validate(raw);

        if (validationResult.errors.length > 0) {
          this.validationErrors = validationResult.errors;
          this.displayDialog(this.validationErrors);
        } else {
          this.selectedTabIndex = 0;
          this.loadedGrammar = validationResult.unformattedGrammar;
        }
      } catch (err) {
        console.error('Error en parse del formato UnformattedGrammar:', err);
      }
    };

    reader.onerror = () => {
      console.error(`Error al leer el fichero: ${file.name}`);
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
