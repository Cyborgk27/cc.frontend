import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSecurity } from './new-security';

describe('NewSecurity', () => {
  let component: NewSecurity;
  let fixture: ComponentFixture<NewSecurity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewSecurity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSecurity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
