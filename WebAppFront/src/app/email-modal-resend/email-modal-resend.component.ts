import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmailConfirmationRecovery } from '../modeli';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-email-modal-resend',
  templateUrl: './email-modal-resend.component.html',
  styleUrls: ['./email-modal-resend.component.css']
})
export class EmailModalResendComponent implements OnInit, OnDestroy {

  private subscribtion: Subscription = new Subscription();
  emailConfirmationFormGroup: FormGroup;
  success: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService) { 

      this.emailConfirmationFormGroup = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.email])]
      });
    }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

  ResendConfirmationEmail(){
    if(this.emailConfirmationFormGroup.invalid){
      return;
    }
    let model = new EmailConfirmationRecovery(this.emailConfirmationFormGroup.controls.email.value);
    this.subscribtion.add(this.userService.EmailConfirmationResend(model).subscribe(response=>{
      console.log(response);
      this.success = true;
    },err=>{
      this.success = false;
      console.log(err);
    }))
  }

}
