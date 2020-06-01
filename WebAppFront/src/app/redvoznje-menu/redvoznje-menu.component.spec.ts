import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedvoznjeMenuComponent } from './redvoznje-menu.component';

describe('RedvoznjeMenuComponent', () => {
  let component: RedvoznjeMenuComponent;
  let fixture: ComponentFixture<RedvoznjeMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedvoznjeMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedvoznjeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
