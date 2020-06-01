import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenovnikCreateComponent } from './cenovnik-create.component';

describe('CenovnikCreateComponent', () => {
  let component: CenovnikCreateComponent;
  let fixture: ComponentFixture<CenovnikCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenovnikCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenovnikCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
