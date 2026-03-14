import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSystem } from './list-system';

describe('ListSystem', () => {
  let component: ListSystem;
  let fixture: ComponentFixture<ListSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
