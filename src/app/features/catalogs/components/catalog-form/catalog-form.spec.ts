import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogForm } from './catalog-form';

describe('CatalogForm', () => {
  let component: CatalogForm;
  let fixture: ComponentFixture<CatalogForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CatalogForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
