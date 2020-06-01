import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthHttpService } from '../services/auth.service';

@Component({
  selector: 'app-admin-user-operations',
  templateUrl: './admin-user-operations.component.html',
  styleUrls: ['./admin-user-operations.component.css']
})
export class AdminUserOperationsComponent implements OnInit, OnDestroy {

  private subscription: Subscription  = new Subscription();
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['Email','Role'];
  selectedRows : Array<any> = new Array<any>();
  helperArray: Array<any> = new Array<any>();
  rolesRadioButton: FormGroup;
  rolesArray: string[] = ['Admin','Controller','AppUser'];

  constructor(public dialogRef: MatDialogRef<AdminUserOperationsComponent>,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private authService: AuthHttpService) {
    this.rolesRadioButton = this.formBuilder.group({
      role : ['']
    });
  }

  ngOnInit() {
    //sync
    let currentUserName = this.authService.GetName();

    //async
    this.subscription.add(this.userService.GetAllUsers().subscribe(data=>{
      data.forEach(user=>{
        user.Clickable=true;
        if(user.Id != currentUserName){
          this.subscription.add(this.userService.GetRoleForUser(user.Id).subscribe(role=>{
            user.Role = role;
            user.availableOptionsForUser = this.rolesArray.filter(x=> x != user.Role);
          },err=>{
            console.log(err);
          }));
        }
      });
      this.dataSource = new MatTableDataSource(data);
      this.helperArray = data;
    },err=>{
      console.log(err);
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectLine(row: any) {
    if(row.Selected)
    {
      row.Selected = false;
      let index = this.selectedRows.findIndex(x => x.Id == row.Id);
      this.selectedRows.splice(index,1);
      for(let el in this.helperArray){
        if(this.helperArray[el].TransportLineID != row.TransportLineID){
          this.helperArray[el].Clickable = true;
        }
      }
    } else
    {
      row.Selected = true;
      this.selectedRows.push(row);
      for(let el in this.helperArray){
        if(this.helperArray[el].TransportLineID != row.TransportLineID){
          this.helperArray[el].Clickable = false;
        }
      }
    }
    this.dataSource = new MatTableDataSource(this.helperArray);
  }

  AddToRole(selected:any){
    console.log(this.rolesRadioButton.controls.role.value);
    if(!this.rolesRadioButton.controls.role.value){
      console.log('NE ME ZE');
      return;
    }
    this.subscription.add(this.userService.AddToRole(selected.Id,this.rolesRadioButton.controls.role.value).subscribe(data=>{
      this.helperArray.forEach(item => {
        if(item.Id == selected.Id){
          item.Role = this.rolesRadioButton.controls.role.value;
          item.Clickable = true;
        }
      });
      this.dataSource = new MatTableDataSource(this.helperArray);
    },err=>{
      console.log(err);
    }));
  }

  RemoveFromRole(selected:any){
    this.subscription.add(this.userService.RemoveFromRole(selected.Id).subscribe(data=>{
      this.helperArray.forEach(item => {
        if(item.Id == selected.Id){
          item.Role = "AppUser";
          item.Clickable = true;
        }
      });
      this.dataSource = new MatTableDataSource(this.helperArray);
    },err=>{
      console.log(err);
    }));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
