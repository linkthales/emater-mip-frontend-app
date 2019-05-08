import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSamplesComponent } from './list-samples.component';

describe('ListSamplesComponent', () => {
  let component: ListSamplesComponent;
  let fixture: ComponentFixture<ListSamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListSamplesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
