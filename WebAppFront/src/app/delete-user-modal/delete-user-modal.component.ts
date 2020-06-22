import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthHttpService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';


@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styleUrls: ['./delete-user-modal.component.css']
})
export class DeleteUserModalComponent implements OnInit {

  private subscribtion: Subscription = new Subscription();
  
  constructor(
    private userService: UserService,
    private router: Router,
    public dialogRef: MatDialogRef<DeleteUserModalComponent>,
    public dialog: MatDialog,
    private authService: AuthHttpService
    ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.subscribtion.add(this.userService.DeleteSelf().subscribe(response=>{
      console.log(response);
      this.onNoClick();
      this.LogOut();
    }));
  }
  
  LogOut(){
    this.authService.LogOut().subscribe(data=>{
      localStorage.removeItem('jwt');
      this.router.navigate(['/home']);
    }, err=>{
      console.log(err);
    });
  }

}
