import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTable } from './generic-table';

describe('GenericTable', () => {
  let component: GenericTable;
  let fixture: ComponentFixture<GenericTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
