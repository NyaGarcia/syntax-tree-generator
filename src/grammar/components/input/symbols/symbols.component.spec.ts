import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolsComponent } from './symbols.component';

describe('TerminalsComponent', () => {
  let component: SymbolsComponent;
  let fixture: ComponentFixture<SymbolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymbolsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SymbolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
