import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFeatures } from './manage-features';

describe('ManageFeatures', () => {
  let component: ManageFeatures;
  let fixture: ComponentFixture<ManageFeatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageFeatures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFeatures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
