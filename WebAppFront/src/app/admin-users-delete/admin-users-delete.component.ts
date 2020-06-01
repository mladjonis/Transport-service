import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatDialogRef } from '@angular/material';
import { UserService } from '../services/user.service';
import { AuthHttpService } from '../services/auth.service';

@Component({
  selector: 'app-admin-users-delete',
  templateUrl: './admin-users-delete.component.html',
  styleUrls: ['./admin-users-delete.component.css']
})
export class AdminUsersDeleteComponent implements OnInit {

  private subscription: Subscription  = new Subscription();
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['Email','Role'];
  selectedRows : Array<any> = new Array<any>();
  helperArray: Array<any> = new Array<any>();
  rolesArray: string[] = ['Admin','Controller','AppUser'];

  constructor(public dialogRef: MatDialogRef<AdminUsersDeleteComponent>,
    private userService: UserService,
    private authService: AuthHttpService) { }

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

  onNoClick(): void {
    this.dialogRef.close();
  }

  RemoveUser(selected:any){
    this.subscription.add(this.userService.DeleteUser(selected.Id).subscribe(data=>{
      let idx = this.helperArray.findIndex(a=>a.TransportLineID == this.selectedRows[0].TransportLineID);
      this.helperArray.splice(idx,1);
      this.selectedRows = [];
      this.helperArray.forEach(item=>{
        item.Clickable = true;
      });
      this.dataSource = new MatTableDataSource(this.helperArray);
    },err=>{
      console.log(err);
    }));
  }

}
