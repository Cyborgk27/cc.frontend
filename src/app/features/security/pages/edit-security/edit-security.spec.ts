import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSecurity } from './edit-security';

describe('EditSecurity', () => {
  let component: EditSecurity;
  let fixture: ComponentFixture<EditSecurity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSecurity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSecurity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
