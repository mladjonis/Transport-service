import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AdminUserOperationsComponent } from '../admin-user-operations/admin-user-operations.component';
import { AdminUsersDeleteComponent } from '../admin-users-delete/admin-users-delete.component';

@Component({
  selector: 'app-admin-users-menu',
  templateUrl: './admin-users-menu.component.html',
  styleUrls: ['./admin-users-menu.component.css']
})
export class AdminUsersMenuComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<AdminUsersMenuComponent>) { }

  ngOnInit() {
  }

  UserRoles(): void {
    const dialogRef = this.dialog.open(AdminUserOperationsComponent,{
      width: '500px',
      height: '500px'
    });

  }

  DeleteUser(): void {
    const dialogRef = this.dialog.open(AdminUsersDeleteComponent,{
      width: '500px',
      height: '500px'
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
