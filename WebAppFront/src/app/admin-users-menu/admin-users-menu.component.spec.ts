import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersMenuComponent } from './admin-users-menu.component';

describe('AdminUsersMenuComponent', () => {
  let component: AdminUsersMenuComponent;
  let fixture: ComponentFixture<AdminUsersMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUsersMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
