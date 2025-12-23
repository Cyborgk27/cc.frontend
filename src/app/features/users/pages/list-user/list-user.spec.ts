import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUser } from './list-user';

describe('ListUser', () => {
  let component: ListUser;
  let fixture: ComponentFixture<ListUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
