import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { ResetPasswordBindingModel } from '../modeli';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit, OnDestroy {

  private subscribtion: Subscription = new Subscription();
  passwordRecoveryFromGroup: FormGroup;
  email: string;
  token: string;
  success: boolean;



  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService) {

    this.route.queryParams.subscribe(map => map);
    this.passwordRecoveryFromGroup = this.formBuilder.group({
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', RxwebValidators.compare({fieldName:'newPassword'})]
    });
    //ovo srediti kada se pokrene
    console.log(this.route.snapshot.queryParams); 
    this.email = this.route.snapshot.queryParams.email;
    this.token = this.route.snapshot.queryParams.token;
  }

  get f() { return this.passwordRecoveryFromGroup.controls; }

  controlGetter(field: string) {
    return this.passwordRecoveryFromGroup.controls[field].value;
  }

  validatePassword(password: string, confirmPassword: string){
    return password === confirmPassword;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

  ChangePassword() {
    if(this.passwordRecoveryFromGroup.invalid){
      return;
    }
    let model = new ResetPasswordBindingModel(this.f.newPassword.value,this.f.confirmPassword.value,this.email,this.token);

    console.log(model);
    this.subscribtion.add(this.userService.ResetPassword(model).subscribe(response=>{
      console.log(response);
      this.success = true;
    },err=>{
      this.success = false;
      console.log(err);
    }));
  }

  Login() {
    this.router.navigate(['prijava']);
  }

}
