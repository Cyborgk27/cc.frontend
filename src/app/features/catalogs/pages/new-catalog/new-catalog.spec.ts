import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCatalog } from './new-catalog';

describe('NewCatalog', () => {
  let component: NewCatalog;
  let fixture: ComponentFixture<NewCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewCatalog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCatalog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
