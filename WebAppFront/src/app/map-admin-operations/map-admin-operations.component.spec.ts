import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapAdminOperationsComponent } from './map-admin-operations.component';

describe('MapAdminOperationsComponent', () => {
  let component: MapAdminOperationsComponent;
  let fixture: ComponentFixture<MapAdminOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapAdminOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapAdminOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
