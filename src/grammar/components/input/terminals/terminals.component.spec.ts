import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalsComponent } from './terminals.component';

describe('TerminalsComponent', () => {
  let component: TerminalsComponent;
  let fixture: ComponentFixture<TerminalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TerminalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
