import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSecurity } from './list-security';

describe('ListSecurity', () => {
  let component: ListSecurity;
  let fixture: ComponentFixture<ListSecurity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSecurity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSecurity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
