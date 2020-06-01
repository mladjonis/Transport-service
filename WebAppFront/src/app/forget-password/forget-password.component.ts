import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { PasswordRecovery } from '../modeli';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  private subscription: Subscription = new Subscription();
  passwordRecoveryFormGroup: FormGroup;
  success: boolean;

  constructor(public dialogRef: MatDialogRef<ForgetPasswordComponent>,
              private formBuilder: FormBuilder,
              private userService: UserService) {
    this.passwordRecoveryFormGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  get f() { return this.passwordRecoveryFormGroup.controls; }

  ngOnInit() {
  }

  SendRecoveryMail() {
    let model: PasswordRecovery = new PasswordRecovery(this.f.email.value);
    if(this.f.email.invalid){
      return;
    }
    this.subscription.add(this.userService.PasswordRecovery(model).subscribe(response=>{
      console.log(response);
      this.success = true;
    },err=>{
      this.success = false;
      console.log(err);
    }));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
