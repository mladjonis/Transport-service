import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { RedvoznjeEditComponent } from '../redvoznje-edit/redvoznje-edit.component';
import { RedvoznjeCreateComponent } from '../redvoznje-create/redvoznje-create.component';
import { RedvoznjeDeleteComponent } from '../redvoznje-delete/redvoznje-delete.component';

@Component({
  selector: 'app-redvoznje-menu',
  templateUrl: './redvoznje-menu.component.html',
  styleUrls: ['./redvoznje-menu.component.css']
})
export class RedvoznjeMenuComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RedvoznjeMenuComponent>,
    public dialog: MatDialog) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  EditRedvoznje() {
    const dialogRef = this.dialog.open(RedvoznjeEditComponent,{
      height: '500px',
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //mozda bude trebalo
      }
    });
  }

  CreateRedvoznje() {
    const dialogRef = this.dialog.open(RedvoznjeCreateComponent,{
      height: '500px',
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //mozda bude trebalo
      }
    });
  }

  DeleteRedvoznje() {
    const dialogRef = this.dialog.open(RedvoznjeDeleteComponent,{
      height: '500px',
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //mozda bude trebalo
      }
    });
  }

}
