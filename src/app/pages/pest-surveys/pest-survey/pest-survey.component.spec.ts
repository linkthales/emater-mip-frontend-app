import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PestSurveyComponent } from './pest-survey.component';

describe('PestSurveyComponent', () => {
  let component: PestSurveyComponent;
  let fixture: ComponentFixture<PestSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PestSurveyComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PestSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
