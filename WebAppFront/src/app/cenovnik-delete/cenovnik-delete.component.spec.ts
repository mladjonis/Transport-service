import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenovnikDeleteComponent } from './cenovnik-delete.component';

describe('CenovnikDeleteComponent', () => {
  let component: CenovnikDeleteComponent;
  let fixture: ComponentFixture<CenovnikDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenovnikDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenovnikDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
