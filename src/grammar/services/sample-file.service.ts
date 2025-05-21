import { Injectable } from '@angular/core';
import { UnformattedGrammar } from '../interfaces/production-rule.interface';

@Injectable({
  providedIn: 'root',
})
export class SampleFileService {
  private sampleGrammar = {
    nonTerminals: ['A', 'B', 'C'],
    terminals: ['a', 'b', 'c', 'ε'],
    productionRules: [
      {
        leftProductionRule: 'A',
        rightProductionRule: ['a', 'B'],
      },
      {
        leftProductionRule: 'A',
        rightProductionRule: ['ε'],
      },
      {
        leftProductionRule: 'B',
        rightProductionRule: ['b', 'A'],
      },
      {
        leftProductionRule: 'B',
        rightProductionRule: ['C'],
      },
      {
        leftProductionRule: 'C',
        rightProductionRule: ['c', 'C'],
      },
      {
        leftProductionRule: 'C',
        rightProductionRule: ['ε'],
      },
    ],
  };

  constructor() {}

  getGrammar(): UnformattedGrammar {
    return this.sampleGrammar;
  }

  downloadSampleFile() {
    const grammarString = JSON.stringify(this.sampleGrammar);
    this.generateFile(grammarString);
  }

  downloadGrammarFile(grammar: UnformattedGrammar) {
    const grammarString = JSON.stringify(grammar);
    this.generateFile(grammarString);
  }

  private generateFile(grammarString: string) {
    const blob = new Blob([grammarString], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'grammar.json';
    a.click();

    URL.revokeObjectURL(url);
  }
}
