import { TestBed } from '@angular/core/testing';
import { SampleFileService } from './sample-file.service';
import { UnformattedGrammar } from '../interfaces/production-rule.interface';

describe('SampleFileService', () => {
  let service: SampleFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the sample grammar', () => {
    const grammar = service.getGrammar();
    expect(grammar).toBeTruthy();
    expect(grammar.nonTerminals).toEqual(['A', 'B', 'C']);
    expect(grammar.terminals).toContain('ε');
    expect(grammar.productionRules.length).toBeGreaterThan(0);
  });

  it('should trigger download of the sample grammar file', () => {
    spyOn(service as any, 'generateFile');

    service.downloadSampleFile();

    expect((service as any).generateFile).toHaveBeenCalled();
    const calledWith = (service as any).generateFile.calls.mostRecent().args[0];
    expect(typeof calledWith).toBe('string');
  });

  it('should trigger download of a custom grammar file', () => {
    const customGrammar: UnformattedGrammar = {
      nonTerminals: ['S'],
      terminals: ['a'],
      productionRules: [
        { leftProductionRule: 'S', rightProductionRule: ['a'] },
      ],
    };

    spyOn(service as any, 'generateFile');

    service.downloadGrammarFile(customGrammar);

    expect((service as any).generateFile).toHaveBeenCalled();
    const calledWith = (service as any).generateFile.calls.mostRecent().args[0];
    expect(calledWith).toContain('"S"');
  });

  it('should create a Blob, anchor, and trigger a download in generateFile', () => {
    const clickSpy = jasmine.createSpy('click');
    const createElementSpy = spyOn(document, 'createElement').and.callFake(
      () =>
        ({
          click: clickSpy,
          setAttribute: () => {},
          href: '',
          download: '',
        } as unknown as HTMLAnchorElement)
    );

    const revokeSpy = spyOn(URL, 'revokeObjectURL');
    const blobSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob-url');

    const testGrammarString = '{"terminals":["a"]}';
    (service as any).generateFile(testGrammarString);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(blobSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalledWith('blob-url');
  });
});
