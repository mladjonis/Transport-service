import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { PricelistService } from '../services/pricelist.service';

@Component({
  selector: 'app-cenovnik-edit',
  templateUrl: './cenovnik-edit.component.html',
  styleUrls: ['./cenovnik-edit.component.css']
})
export class CenovnikEditComponent implements OnInit {

  editCenovnikFormGroup: FormGroup;
  constructor(public dialogRef: MatDialogRef<CenovnikEditComponent>,
    private formBuilder: FormBuilder,
    private pricelistService: PricelistService) {

      this.editCenovnikFormGroup = this.formBuilder.group({
        pricelistId: [''],
        from: [''],
        data: [''],
        regularna : ['', Validators.compose([Validators.required, Validators.min(50), Validators.max(150)])],
        dnevna : ['', Validators.compose([Validators.required, Validators.min(50), Validators.max(300)])],
        mesecna : ['', Validators.compose([Validators.required, Validators.min(50), Validators.max(3500)])],
        godisnja : ['', Validators.compose([Validators.required, Validators.min(50), Validators.max(20000)])]    
      });
    }

  get f() { return this.editCenovnikFormGroup.controls; }

  ngOnInit() { 
    this.pricelistService.GetCurrentPricelist().subscribe(data=>{
      this.f.regularna.setValue(data.PriceFinals[data.PriceFinals.findIndex(x=>x.Ticket.TicketType == "regularna")].Price);
      this.f.dnevna.setValue(data.PriceFinals[data.PriceFinals.findIndex(x=>x.Ticket.TicketType == "dnevna")].Price);
      this.f.mesecna.setValue(data.PriceFinals[data.PriceFinals.findIndex(x=>x.Ticket.TicketType == "mesecna")].Price);
      this.f.godisnja.setValue(data.PriceFinals[data.PriceFinals.findIndex(x=>x.Ticket.TicketType == "godisnja")].Price);
      this.f.pricelistId.setValue(data.ID);
      this.f.from.setValue(data.From);
      this.f.data.setValue(JSON.stringify(data));
    },err=>{
      console.log(err);
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
