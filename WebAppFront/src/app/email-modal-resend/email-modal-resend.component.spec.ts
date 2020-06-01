import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailModalResendComponent } from './email-modal-resend.component';

describe('EmailModalResendComponent', () => {
  let component: EmailModalResendComponent;
  let fixture: ComponentFixture<EmailModalResendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailModalResendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailModalResendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
