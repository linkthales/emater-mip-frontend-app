import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroRegionComponent } from './macroregion.component';

describe('MacroRegionComponent', () => {
  let component: MacroRegionComponent;
  let fixture: ComponentFixture<MacroRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MacroRegionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacroRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
