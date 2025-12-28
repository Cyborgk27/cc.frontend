import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureForm } from './feature-form';

describe('FeatureForm', () => {
  let component: FeatureForm;
  let fixture: ComponentFixture<FeatureForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeatureForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
