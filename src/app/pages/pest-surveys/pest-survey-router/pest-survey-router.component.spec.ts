import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PestSurveyRouterComponent } from './pest-survey-router.component';

describe('PestSurveyRouterComponent', () => {
  let component: PestSurveyRouterComponent;
  let fixture: ComponentFixture<PestSurveyRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PestSurveyRouterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PestSurveyRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
