import { Component, OnInit, OnDestroy } from '@angular/core';
import { PricelistService } from '../services/pricelist.service';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cenovnik-delete',
  templateUrl: './cenovnik-delete.component.html',
  styleUrls: ['./cenovnik-delete.component.css']
})
export class CenovnikDeleteComponent implements OnInit, OnDestroy {

  private subscription: Subscription  = new Subscription();
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['From','To'];
  selectedRows : Array<any> = new Array<any>();
  helperArray: Array<any> = new Array<any>();

  constructor(public dialogRef: MatDialogRef<CenovnikDeleteComponent>,
            private pricelistService: PricelistService) { }

  ngOnInit() {
    this.subscription.add(this.pricelistService.GetPastPricelists().subscribe(data=>{
      this.dataSource = new MatTableDataSource(data);
      this.helperArray = [...data];
    }, err=>{
      console.log(err);
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectPricelist(row: any) {
    if(row.Selected)
    {
      row.Selected = false;
      let index = this.selectedRows.findIndex(x => x.LineId == row.Id);
      this.selectedRows.splice(index,1);
    }else
    {
      row.Selected = true;
      this.selectedRows.push(row);
    }
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  DeletePricelist(selected : any) {
    this.subscription.add(this.pricelistService.DeletePricelist(selected.ID).subscribe(data=>{
      let idx = this.helperArray.findIndex(x=>x.ID == selected.ID);
      this.helperArray.splice(idx,1);
      this.dataSource = new MatTableDataSource(this.helperArray);
    },err=>{
      console.log(err);
    }));
  }

}
