import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { CenovnikEditComponent } from '../cenovnik-edit/cenovnik-edit.component';
import { CenovnikCreateComponent } from '../cenovnik-create/cenovnik-create.component';
import { CenovnikDeleteComponent } from '../cenovnik-delete/cenovnik-delete.component';
import { PricelistService } from '../services/pricelist.service';
import { PriceFinalService } from '../services/pricefinal.service';
import { Subscription } from 'rxjs';
import { Pricelist, PriceFinal } from '../modeli';

@Component({
  selector: 'app-pricelist-menu',
  templateUrl: './pricelist-menu.component.html',
  styleUrls: ['./pricelist-menu.component.css']
})
export class PricelistMenuComponent implements OnInit, OnDestroy {

  private subscription : Subscription = new Subscription();
  
  constructor(public dialogRef: MatDialogRef<PricelistMenuComponent>,
              public dialog: MatDialog,
              private pricelistService: PricelistService,
              private priceFinalService: PriceFinalService){}

  
  ngOnInit() {
  }
            

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  EditPricelist() {
    const dialogRef = this.dialog.open(CenovnikEditComponent,{
      height: '500px',
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let data = JSON.parse(result.data);
        console.log(data);
        
        data.PriceFinals[data.PriceFinals.findIndex(x=>x.Ticket.TicketType == "regularna")].Price = result.regularna;
        data.PriceFinals[data.PriceFinals.findIndex(x=>x.Ticket.TicketType == "dnevna")].Price = result.dnevna;
        data.PriceFinals[data.PriceFinals.findIndex(x=>x.Ticket.TicketType == "mesecna")].Price = result.mesecna;
        data.PriceFinals[data.PriceFinals.findIndex(x=>x.Ticket.TicketType == "godisnja")].Price = result.godisnja;
        this.subscription.add(this.pricelistService.EditPricelist(result.pricelistId,data).subscribe(data=>{
          console.log(data);
        },err=>{
          console.log(err);
        }));
      }
    });
  }

  CreatePricelist() {
    const dialogRef = this.dialog.open(CenovnikCreateComponent,{
      height: '650px',
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let pricelist = new Pricelist();
        pricelist.From = new Date();
        this.subscription.add(this.pricelistService.CreatePricelist(pricelist).subscribe(data=>{
          let priceFinalReg = new PriceFinal(result.regularna);
          let priceFinalDn = new PriceFinal(result.dnevna);
          let priceFinalMes = new PriceFinal(result.mesecna);
          let priceFinalGod = new PriceFinal(result.godisnja);
          let priceArray = JSON.stringify([priceFinalReg, priceFinalDn, priceFinalMes, priceFinalGod]);
          this.subscription.add(this.priceFinalService.CreatePriceFinal(data,priceArray).subscribe(data=>{
            //console.log(data);
          },err=>{
            console.log(err);
          }));
        },err=>{
          console.log(err);
        }));
      }
    });
  }

  DeletePricelist() {
    const dialogRef = this.dialog.open(CenovnikDeleteComponent,{
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
