import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthHttpService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { RegUser } from '../modeli';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})

export class RegistracijaComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  registerFormGroup: FormGroup;
  @ViewChild('stepper',{static:true}) private myStepper: MatStepper;
  file: File;
  imgURL: any;
  userExists: boolean = false;
  success: boolean = false;


  constructor(private authService: AuthHttpService, 
              private fb: FormBuilder,
              private router: Router) {   }

  ngOnInit() {

    this.registerFormGroup = this.fb.group({
      formArray: this.fb.array([
        this.fb.group({name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])]}),
        this.fb.group({surname: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])]}),
        this.fb.group({address: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(25)])]}),
        this.fb.group({email: ['', Validators.compose([Validators.required, Validators.email])]}),
        this.fb.group({password: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(25)])],
                      confirmPassword: ['', RxwebValidators.compare({fieldName:'password'})]}),
        this.fb.group({date: ['', Validators.required]}),
        this.fb.group({usertype: ['', Validators.required]}),
        this.fb.group({doc: ['']}),
        this.fb.group({tos: ['']})
      ])
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  validatePassword(password: string, confirmPassword: string){
    return password === confirmPassword;
  }

  controlGetter(index: number, fieldName: string) { 
    return this.registerFormGroup.controls.formArray.get([index]).get(fieldName).value;
  }

  get f() { return this.registerFormGroup.controls; }

  Submit() {
    let user = new RegUser(
      this.controlGetter(0,'name'),
      this.controlGetter(1,'surname'),
      this.controlGetter(3,'email'),
      this.controlGetter(4,'password'),
      this.controlGetter(4,'confirmPassword'),
      new Date(this.controlGetter(5,'date')).toISOString(),
      this.controlGetter(2,'address'),
      this.controlGetter(6,'usertype'),
      this.controlGetter(8,'tos')
    );
    console.log(user);

    this.subscription.add(this.authService.Register(user,this.file).subscribe(data=>{
      this.userExists = false;
      //navigacija na ruter
      this.success = true;
      setTimeout(()=>{
        this.router.navigate(['prijava']);
      },4000);

    },err=>{
      console.log(err);
      if(err.error.Message == "Korisnik sa tim korisnickim imenom vec postoji, probajte drugo!"){
        this.myStepper.selectedIndex = 3;
        this.userExists = true;
        this.registerFormGroup.controls.formArray.get([3]).get('email').reset();
      }
    }));
  }


  onFileChanged(event) {
    this.file = event.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(this.file); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  selectChange(event){
    this.f.formArray.get([6]).get('usertype').setValue(event.value);
  }
}
