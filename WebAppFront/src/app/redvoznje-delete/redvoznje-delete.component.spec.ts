import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedvoznjeDeleteComponent } from './redvoznje-delete.component';

describe('RedvoznjeDeleteComponent', () => {
  let component: RedvoznjeDeleteComponent;
  let fixture: ComponentFixture<RedvoznjeDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedvoznjeDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedvoznjeDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
