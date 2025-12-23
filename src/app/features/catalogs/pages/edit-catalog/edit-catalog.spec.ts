import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCatalog } from './edit-catalog';

describe('EditCatalog', () => {
  let component: EditCatalog;
  let fixture: ComponentFixture<EditCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCatalog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCatalog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
