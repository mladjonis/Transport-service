import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersDeleteComponent } from './admin-users-delete.component';

describe('AdminUsersDeleteComponent', () => {
  let component: AdminUsersDeleteComponent;
  let fixture: ComponentFixture<AdminUsersDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUsersDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
