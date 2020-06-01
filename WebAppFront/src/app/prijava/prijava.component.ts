import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthHttpService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, 
         Validators } from '@angular/forms';
import { DataSharingService } from '../services/data-sharing.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { UserService } from '../services/user.service';
import { EmailModalResendComponent } from '../email-modal-resend/email-modal-resend.component';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css']
})
export class PrijavaComponent implements OnInit,OnDestroy {

  private subscription: Subscription = new Subscription();
  loginFormGroup: FormGroup;
  hide: boolean = true;
  loginFailure: boolean = false;

  constructor(private authService: AuthHttpService, 
              private router: Router, 
              private fb: FormBuilder, 
              private dataSharingService: DataSharingService,
              public dialog: MatDialog,
              private userService: UserService) { 

    this.loginFormGroup = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
      remember: ['']
    });
  }

  get f() { return this.loginFormGroup.controls; }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  Login() {
    this.subscription.add(this.authService.logIn(this.f.email.value,this.f.password.value).subscribe(data=>{
      const name = this.authService.GetName();
      const role = this.authService.GetRole();
      this.loginFailure = false;
      this.dataSharingService.loggedInName.next({'role':role ,'name':name, 'loggedIn':true, 'rememberMe':this.f.remember.value });
      this.router.navigate(['/home']);
    }, err=> {
      console.log(err);
      if(err.error.error_description == "AppUser did not confirm email."){
        this.loginFormGroup.setErrors({
          emailNotConfirmed: true
        });
      }else {
        this.loginFailure=true;
        this.loginFormGroup.reset(); 
      }
    }));
  }

  ResendConfirmEmail() {
    const dialogRef = this.dialog.open(EmailModalResendComponent,{
      height: '300px',
      width: '350px'
    });
  }

  ForgotPassword() {
    const dialogRef = this.dialog.open(ForgetPasswordComponent,{
      height: '300px',
      width: '350px'
    });
  }
}
