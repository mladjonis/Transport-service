import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedvoznjeEditComponent } from './redvoznje-edit.component';

describe('RedvoznjeEditComponent', () => {
  let component: RedvoznjeEditComponent;
  let fixture: ComponentFixture<RedvoznjeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedvoznjeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedvoznjeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
