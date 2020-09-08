import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserProfile, ChangePasswordBindingModel } from '../modeli';
import { AuthHttpService } from '../services/auth.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material';
import { DeleteUserModalComponent } from '../delete-user-modal/delete-user-modal.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit,OnDestroy {

  private subscription: Subscription = new Subscription();
  profilFormGroup: FormGroup;
  changePasswordForumGroup: FormGroup;
  exportFormGroup: FormGroup;
  tosFormGroup: FormGroup;
  userProfile: UserProfile;
  hide: boolean = false;
  hideConfirmed: boolean = false;
  hideOldPassword: boolean = false;
  docUrl: string;
  base_url = "http://localhost:52295";
  userId: string;
  role: string;
  file: File;
  imgURL: any;
  updateSuccess: boolean = false;
  oldPasswordInCorrect: boolean = false;
  success: boolean = false;
  tickets: Array<any> = new Array<any>();


  constructor(
    private authService: AuthHttpService, 
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog) { }


  ngOnInit() {

    this.userId = this.authService.GetName();
    this.role = this.authService.GetRole();

    if(this.role == 'AppUser'){
      this.profilFormGroup = this.fb.group({
        name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
        surname: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
        adress: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(25)])],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        date: ['', Validators.required],
        usertype: ['', Validators.required]
      });
      this.tosFormGroup = this.fb.group({
        tos: ['']
      });
    }else {
      this.profilFormGroup = this.fb.group({
        name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
        surname: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
        adress: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(25)])],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        date: ['', Validators.required]
      });
    }

    this.changePasswordForumGroup = this.fb.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(25)])],
      confirmPassword: ['', RxwebValidators.compare({fieldName:'password'})],
    });

    this.exportFormGroup = this.fb.group({
      csv: [''],
      pdf: ['']
    })

    this.subscription.add(this.userService.GetUserProfileInfo(this.userId).subscribe(user => {
      //???
      this.tickets = [...user.Tickets];
      // this.tickets.push(user.Tickets[4]);
      // this.tickets.push(user.Tickets[5]);
      console.log(this.tickets);
      console.log(user);

      if(this.role == 'AppUser'){
        this.userProfile = new UserProfile(
          user.NameEncrypted, user.SurnameEncrypted, 
          user.EmailEncrypted, user.AdressEncrypted,
          user.DateOfBirth, this.userService.ConvertTypeOfUserToString(user.UserType.TypeOfUser));
      } else {
        this.userProfile = new UserProfile(
          user.NameEncrypted, user.SurnameEncrypted, 
          user.EmailEncrypted, user.AdressEncrypted,
          user.DateOfBirth, ' ');
      }
         
      this.f.name.setValue(this.userProfile.Name);
      this.f.surname.setValue(this.userProfile.Surname);
      this.f.adress.setValue(this.userProfile.Adress);
      this.f.email.setValue(this.userProfile.Email);
      this.f.date.setValue(new Date(this.userProfile.DateOfBirth).toISOString().split('T')[0]);
      if(this.role == 'AppUser'){
        this.tosFormGroup.controls.tos.setValue(user.AcceptedTOS);
        this.f.usertype.setValue(this.userProfile.UserType);
        this.docUrl = `${this.base_url}/imgs/users/${this.userId}/${user.Files}`;
      }
    }, err=> {
      console.log(err);
    }));
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  UpdateProfile() {
    this.subscription.add(this.userService.UpdateUserProfile(this.userId, this.GetUserProfileFromForm()).subscribe(data =>{
      this.updateSuccess = true;
    }, err=>{
      console.log(err);
      this.updateSuccess = false;
      this.profilFormGroup.invalid;
    }));
  }

  ChangePassword() {
    let pwBindingModel = new ChangePasswordBindingModel(this.passwordGetter('oldPassword'),this.passwordGetter('password'), this.passwordGetter('confirmPassword'));
    this.subscription.add(this.userService.ChangePassword(pwBindingModel).subscribe(data=>{
      this.oldPasswordInCorrect = false;
      this.success = true;
    },err=>{
      console.log(err);
      this.oldPasswordInCorrect = true;
      this.success = false;
      this.changePasswordForumGroup.controls.oldPassword.reset();
    }));
  }

  GetUserProfileFromForm(): UserProfile {
    let updateUserProfileModel;
    if(this.role == 'AppUser'){
    updateUserProfileModel = new UserProfile(
      this.controlGetter('name'), this.controlGetter('surname'), 
      this.controlGetter('email'), this.controlGetter('adress'),
      this.controlGetter('date'), this.controlGetter('usertype'));
    }else {
    updateUserProfileModel = new UserProfile(
      this.controlGetter('name'), this.controlGetter('surname'), 
      this.controlGetter('email'), this.controlGetter('adress'),
      this.controlGetter('date'),' ');
    }
    return updateUserProfileModel;
  }

  UploadPicture() {
    if(this.imgURL){
      this.subscription.add(this.userService.UploadPicture(this.file).subscribe(data=>{
        this.docUrl = `${this.base_url}/imgs/users/${this.userId}/${this.file}`;
      }));
    }
  }

  validatePassword(password: string, confirmPassword: string){
    return password === confirmPassword;
  }

  controlGetter(fieldName: string) { 
    return this.profilFormGroup.controls[fieldName].value;
  }

  passwordGetter(fieldName: string) {
    return this.changePasswordForumGroup.controls[fieldName].value;
  }

  get f() { 
    return this.profilFormGroup.controls; 
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
    this.f.usertype.setValue(event.value);
  }

  DeleteUser() {
    const dialogRef = this.dialog.open(DeleteUserModalComponent,{
      height: '400px',
      width: '400px'
    });
  }

  ChangeTOS() {
    let tos = this.tosFormGroup.controls.tos.value;

    this.subscription.add(this.userService.ChangeTOS(tos).subscribe(response=>{

    },err=>{
      console.log(err);
    }));
  }

  ExportData() {
    let exportType: string;
    let csvValue = this.exportFormGroup.controls.csv.value;
    let pdfValue = this.exportFormGroup.controls.pdf.value;

    if(!csvValue && !pdfValue) {
      this.exportFormGroup.setErrors({ exportInvalid: true});
      console.log('radi export valdiacija')
      this.exportFormGroup.controls.csv.reset();
      this.exportFormGroup.controls.pdf.reset();
      return;
    }

    //if(csvValue && pdfValue){
      exportType = `csv.pdf`;
    // }else if(csvValue){
    //   exportType = `csv`;
    // }else {
    //   exportType = `pdf`;
    // }
    console.log(exportType);

    this.subscription.add(this.userService.Export(exportType).subscribe(response=>{
      let blob;
      let name;
      // if(csvValue && pdfValue){
        blob = new Blob([response], { type: 'application/zip' }); // you can change the type
        name = `${this.userId.replace('.','_')}data.zip`;
      // }else if (csvValue){
      //   blob = new Blob([response], { type: 'application/csv' }); // you can change the type
      //   name = "dataCsv.zip";
      // }else {
      //   blob = new Blob([response], { type: 'application/pdf' }); // you can change the type
      //   name = "data.pdf";
      // }
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      // const url= window.URL.createObjectURL(blob);
      // window.open(url);
    },err=>{
      console.log(err);
    }));
  }
}
