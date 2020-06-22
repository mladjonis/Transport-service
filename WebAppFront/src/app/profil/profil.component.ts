import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserProfile, ChangePasswordBindingModel } from '../modeli';
import { AuthHttpService } from '../services/auth.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material';
import { DeleteUserModalComponent } from '../delete-user-modal/delete-user-modal.component';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  profilFormGroup: FormGroup;
  changePasswordForumGroup: FormGroup;
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

    this.userService.GetUserProfileInfo(this.userId).subscribe(user => {
      //???
      this.tickets = [...user.Tickets];
      // this.tickets.push(user.Tickets[4]);
      // this.tickets.push(user.Tickets[5]);
      console.log(this.tickets);
      console.log(user);

      if(this.role == 'AppUser'){
        this.userProfile = new UserProfile(
          user.Name, user.Surname, 
          user.Email, user.Adress,
          user.DateOfBirth, this.userService.ConvertTypeOfUserToString(user.UserType.TypeOfUser));
      } else {
        this.userProfile = new UserProfile(
          user.Name, user.Surname, 
          user.Email, user.Adress,
          user.DateOfBirth, ' ');
      }
         
      this.f.name.setValue(this.userProfile.Name);
      this.f.surname.setValue(this.userProfile.Surname);
      this.f.adress.setValue(this.userProfile.Adress);
      this.f.email.setValue(this.userProfile.Email);
      this.f.date.setValue(new Date(this.userProfile.DateOfBirth).toISOString().split('T')[0]);
      if(this.role == 'AppUser'){
        this.f.usertype.setValue(this.userProfile.UserType);
        this.docUrl = `${this.base_url}/imgs/users/${this.userId}/${user.Files}`;
      }
    }, err=> {
      console.log(err);
    })
  }

  UpdateProfile() {
    this.userService.UpdateUserProfile(this.userId, this.GetUserProfileFromForm()).subscribe(data =>{

      this.updateSuccess = true;
    }, err=>{
      console.log(err);
      this.updateSuccess = false;
      this.profilFormGroup.invalid;
    });


  }

  ChangePassword() {
    let pwBindingModel = new ChangePasswordBindingModel(this.passwordGetter('oldPassword'),this.passwordGetter('password'), this.passwordGetter('confirmPassword'));
    this.userService.ChangePassword(pwBindingModel).subscribe(data=>{
      this.oldPasswordInCorrect = false;
      this.success = true;
    },err=>{
      console.log(err);
      this.oldPasswordInCorrect = true;
      this.success = false;
      this.changePasswordForumGroup.controls.oldPassword.reset();
    });
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
      this.userService.UploadPicture(this.file).subscribe(data=>{
        this.docUrl = `${this.base_url}/imgs/users/${this.userId}/${this.file}`;
      });
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
}
