import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserOperationsComponent } from './admin-user-operations.component';

describe('AdminUserOperationsComponent', () => {
  let component: AdminUserOperationsComponent;
  let fixture: ComponentFixture<AdminUserOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
