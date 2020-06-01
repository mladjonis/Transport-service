import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PricelistMenuComponent } from '../pricelist-menu/pricelist-menu.component';
import { RedvoznjeMenuComponent } from '../redvoznje-menu/redvoznje-menu.component';
import { MapAdminOperationsComponent } from '../map-admin-operations/map-admin-operations.component';
import { AdminUserOperationsComponent } from '../admin-user-operations/admin-user-operations.component';
import { AdminUsersMenuComponent } from '../admin-users-menu/admin-users-menu.component';

@Component({
  selector: 'app-adminview',
  templateUrl: './adminview.component.html',
  styleUrls: ['./adminview.component.css']
})
export class AdminviewComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {}

  Cenovnik() : void{
    const dialogRef = this.dialog.open(PricelistMenuComponent,{
      width: '400px',
      height: '550px'
    });
  }

  RedVoznje() : void{
    const dialogRef = this.dialog.open(RedvoznjeMenuComponent,{
      width: '400px',
      height: '550px'
    });
  }

  Mapa() : void{
    const dialogRef = this.dialog.open(MapAdminOperationsComponent,{
      maxWidth: '95vw',
      width: '1200px',
      height: '800px'
    });
  }

  Korisnici() : void {
    const dialogRef = this.dialog.open(AdminUsersMenuComponent,{
      width: '500px',
      height: '500px'
    });
  }
}
