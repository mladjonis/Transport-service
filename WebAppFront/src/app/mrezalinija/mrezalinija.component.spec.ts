import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrezalinijaComponent } from './mrezalinija.component';

describe('MrezalinijaComponent', () => {
  let component: MrezalinijaComponent;
  let fixture: ComponentFixture<MrezalinijaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrezalinijaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrezalinijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
