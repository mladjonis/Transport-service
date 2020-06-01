import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenovnikEditComponent } from './cenovnik-edit.component';

describe('CenovnikEditComponent', () => {
  let component: CenovnikEditComponent;
  let fixture: ComponentFixture<CenovnikEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenovnikEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenovnikEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
