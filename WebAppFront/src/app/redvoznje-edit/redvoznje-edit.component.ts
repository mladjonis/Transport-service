import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatDialogRef } from '@angular/material';
import { DepartureService } from '../services/departure.service';
import { LineService } from '../services/line.service';

@Component({
  selector: 'app-redvoznje-edit',
  templateUrl: './redvoznje-edit.component.html',
  styleUrls: ['./redvoznje-edit.component.css']
})
export class RedvoznjeEditComponent implements OnInit {

  editRedvoznjeFormGroup: FormGroup;
  private subscription: Subscription  = new Subscription();
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['TransportLineID','FromTo'];
  selectedRows : Array<any> = new Array<any>();
  helperArray: Array<any> = new Array<any>();
  checkBoxArray: Array<any> = new Array<any>();
  dbCheckBoxArray: Array<any> = new Array<any>();
  dbSubotaArray: Array<any> = new Array<any>();
  dbNedeljaArray: Array<any> = new Array<any>();

  constructor(public dialogRef: MatDialogRef<RedvoznjeEditComponent>,
              private formBuilder: FormBuilder,
              private departureService: DepartureService,
              private lineService: LineService) { 
      this.editRedvoznjeFormGroup = this.formBuilder.group({
        time : ['', Validators.compose([Validators.required])],
        radni: [''],
        subota: [''],
        nedelja: [''] 
      });
  }

  get f() { return this.editRedvoznjeFormGroup.controls; }

  ngOnInit() {
    this.subscription.add(this.departureService.GetNotNullDepartures().subscribe(data=>{
      console.log(data);
      data.forEach(d=> {
        d.Clickable=true;
        d['TimeTable'] = JSON.parse(d['TimeTable']);
      });
      this.dataSource = new MatTableDataSource(data);
      this.helperArray = [...data];
    },err=>{
      console.log(err);
    }));
    // this.subscription.add(this.lineService.GetLines().subscribe(data=>{
    //   console.log(data);
    //   this.subscription.add(this.departureService.GetDepartures().subscribe(departures=>{
    //     console.log(departures);
    //     data.forEach(line=>{
    //       line.Clickable = true;
    //       if(departures.includes(line.TransportLineID)){
    //         line.TimeTable = JSON.parse(departures[line.TransportLineID].TimeTable);
    //       }else {
    //         line.TimeTable = [];
    //       }
    //     });
    //     this.helperArray = [...data];
    //     console.log(data);
    //     this.dataSource = new MatTableDataSource(data);
    //   }))
    // },err=>{
    //   console.log(err);
    // }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectLine(row: any) {  
    if(row.Selected)
    {
      row.Selected = false;
      let index = this.selectedRows.findIndex(x => x.LineId == row.Id);
      this.selectedRows.splice(index,1);
      for(let el in this.helperArray){
        if(this.helperArray[el].TransportLineID != row.TransportLineID){
          this.helperArray[el].Clickable = true;
        }
      }
    }else
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

  CreateRedvoznje(selected: any) {
    console.log(selected);
    if(!this.f.radni.value && !this.f.subota.value && !this.f.nedelja.value) {
      this.editRedvoznjeFormGroup.setErrors({ daysInvalid: true});
      this.f.radni.reset();
      this.f.subota.reset();
      this.f.nedelja.reset();
      return;
    }
    let radni_dan = this.f.radni.value ? true : false;
    let subota = this.f.subota.value ? true : false;
    let nedelja = this.f.nedelja.value ? true : false;
    let validFrom = new Date().toISOString();
    let departure;
    if(radni_dan && nedelja && subota){
      departure = Object.assign({
        "TimeTable" : {
          "Radni_dan" : [...this.checkBoxArray],
          "Subota" : [...this.checkBoxArray],
          "Nedelja" : [...this.checkBoxArray]
        }
      });
    }else if(radni_dan && nedelja && !subota){
      departure = Object.assign({
        "TimeTable" : {
          "Radni_dan" : [...this.checkBoxArray],
          "Nedelja" : [...this.checkBoxArray],
          "Subota" : []
        }
      });
    }else if(radni_dan && subota && !nedelja){
      departure = Object.assign({
        "TimeTable" : {
          "Radni_dan" : [...this.checkBoxArray],
          "Subota" : [...this.checkBoxArray],
          "Nedelja" : []
        }
      });
      console.log(departure);
    }else if(subota && nedelja && !radni_dan){
      departure = Object.assign({
        "TimeTable" : {
          "Subota" : [...this.checkBoxArray],
          "Nedelja" : [...this.checkBoxArray],
          "Radni_dan" : []
        }
      });
    }
    else if(subota && !nedelja && !radni_dan) {
      departure = Object.assign({
        "TimeTable" : {
          "Subota" : [...this.checkBoxArray],
          "Radni_dan" : [],
          "Nedelja" : [],
        }
      });
    }else if(nedelja && !subota && !radni_dan) {
      departure = Object.assign({
        "TimeTable" : {
          "Nedelja" : [...this.checkBoxArray],
          "Radni_dan" : [],
          "Subota" : [],
        }
      });
    }
    else if(radni_dan && !subota && !nedelja){
      departure = Object.assign({
        "TimeTable" : {
          "Radni_dan" : [...this.checkBoxArray],
          "Subota" : [],
          "Nedelja" : [],
        }
      });
    }

    if(this.dbCheckBoxArray.length > 0){
      departure['TimeTable']['Radni_dan'] = [...departure['TimeTable']['Radni_dan'], ...this.dbCheckBoxArray];
      departure['TimeTable']['Radni_dan'].sort((a,b)=>{
        if (parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]) === 0) {
            return parseInt(a.split(":")[1]) - parseInt(b.split(":")[1]);
        } else {
            return parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]);
        }
      });
    } else {
      this.helperArray[this.helperArray.findIndex(i=>i.TransportLineID == this.selectedRows[0].TransportLineID)]
      this.dbCheckBoxArray = [...new Set(this.helperArray[this.helperArray.findIndex(i=>i.TransportLineID == this.selectedRows[0].TransportLineID)].TimeTable['Radni_dan'])];
      departure['TimeTable']['Radni_dan'] = [...departure['TimeTable']['Radni_dan'], ...this.dbCheckBoxArray];
      departure['TimeTable']['Radni_dan'].sort((a,b)=>{
        if (parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]) === 0) {
            return parseInt(a.split(":")[1]) - parseInt(b.split(":")[1]);
        } else {
            return parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]);
        }
      });
      //console.log(this.dbCheckBoxArray);
    } if (this.dbSubotaArray.length > 0) {
      departure['TimeTable']['Subota'] = [...departure['TimeTable']['Subota'], ...this.dbSubotaArray];
      departure['TimeTable']['Subota'].sort((a,b)=>{
        if (parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]) === 0) {
            return parseInt(a.split(":")[1]) - parseInt(b.split(":")[1]);
        } else {
            return parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]);
        }
      });
    }else {
      this.dbSubotaArray = [...new Set(this.helperArray[this.helperArray.findIndex(i=>i.TransportLineID == this.selectedRows[0].TransportLineID)].TimeTable['Subota'])];
      departure['TimeTable']['Subota'] = [...departure['TimeTable']['Subota'], ...this.dbSubotaArray];
      departure['TimeTable']['Subota'].sort((a,b)=>{
        if (parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]) === 0) {
            return parseInt(a.split(":")[1]) - parseInt(b.split(":")[1]);
        } else {
            return parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]);
        }
      });

    }   
    if (this.dbNedeljaArray.length > 0) {
      departure['TimeTable']['Nedelja'] = [...departure['TimeTable']['Nedelja'], ...this.dbNedeljaArray];
      departure['TimeTable']['Nedelja'].sort((a,b)=>{
        if (parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]) === 0) {
            return parseInt(a.split(":")[1]) - parseInt(b.split(":")[1]);
        } else {
            return parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]);
        }
      });
    } else {
      this.dbNedeljaArray = [...new Set(this.helperArray[this.helperArray.findIndex(i=>i.TransportLineID == this.selectedRows[0].TransportLineID)].TimeTable['Nedelja'])];
      departure['TimeTable']['Nedelja'] = [...departure['TimeTable']['Nedelja'], ...this.dbNedeljaArray];
      departure['TimeTable']['Nedelja'].sort((a,b)=>{
        if (parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]) === 0) {
            return parseInt(a.split(":")[1]) - parseInt(b.split(":")[1]);
        } else {
            return parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]);
        }
      });
    }

    departure['ValidFrom'] = validFrom;
    departure['TransportLineID'] = this.selectedRows[0].TransportLineID;
    departure['TimeTable'] = JSON.stringify(departure['TimeTable']);


    this.subscription.add(this.departureService.CreateDepartureForLine(departure).subscribe(data=>{
      console.log(data);
      this.onNoClick();
    }, err=>{
      console.log(err);
    }))
  }

  AddTime(time: any) {
    if(!this.checkBoxArray.includes(time)){
      this.checkBoxArray.push(time);
    }
  }

  CheckBoxToggle(time: any) {
    let idx = this.checkBoxArray.findIndex(x=>x == time);
    this.checkBoxArray.splice(idx,1);
  }

  CheckBoxDbToggle(day:any, time: any) {
    if(day == 'Radni_dan'){
      let idx = this.dbCheckBoxArray.findIndex(x=>x == time);
      this.dbCheckBoxArray.splice(idx,1);
    }else if(day == 'Subota') {
      let idx = this.dbSubotaArray.findIndex(x=>x == time);
      this.dbSubotaArray.splice(idx,1);
    }else if(day == 'Nedelja'){
      let idx = this.dbNedeljaArray.findIndex(x=>x == time);
      this.dbNedeljaArray.splice(idx,1);
    }
  }

  //U EDIT
  selectDay(selected: any,input: string) {
    selected['Day'] = input;
    this.dbCheckBoxArray = [...new Set(selected.TimeTable['Radni_dan'])];
    this.dbSubotaArray = [...new Set(selected.TimeTable['Subota'])];
    this.dbNedeljaArray = [...new Set(selected.TimeTable['Nedelja'])];
    if(input == 'Radni_dan'){
      this.dbCheckBoxArray = [...new Set(selected.TimeTable[input])];
    }else if(input == 'Subota')
    {
      this.dbSubotaArray = [...new Set(selected.TimeTable[input])];
    }else if (input == 'Nedelja'){
      this.dbNedeljaArray = [...new Set(selected.TimeTable[input])];
    }
  }

  timetable(selected: any, input: string) {
    if(input == 'Radni_dan'){
      selected.TimeTable[input] = [...new Set(this.dbCheckBoxArray)];
    }else if(input == 'Subota'){
      selected.TimeTable[input] = [...new Set(this.dbSubotaArray)];
    }
    else if (input == 'Nedelja'){
      selected.TimeTable[input] = [...new Set(this.dbNedeljaArray)];
    }

    return selected.TimeTable[input];
  }
}
