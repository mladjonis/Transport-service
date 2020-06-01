import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedvoznjeCreateComponent } from './redvoznje-create.component';

describe('RedvoznjeCreateComponent', () => {
  let component: RedvoznjeCreateComponent;
  let fixture: ComponentFixture<RedvoznjeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedvoznjeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedvoznjeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
