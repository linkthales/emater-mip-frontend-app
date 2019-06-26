import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyFieldComponent } from './survey-field.component';

describe('SurveyFieldComponent', () => {
  let component: SurveyFieldComponent;
  let fixture: ComponentFixture<SurveyFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyFieldComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
