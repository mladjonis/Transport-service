import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LineService } from '../services/line.service';
import { Subscription } from 'rxjs';
import { DepartureService } from '../services/departure.service';

@Component({
  selector: 'app-redvoznje-create',
  templateUrl: './redvoznje-create.component.html',
  styleUrls: ['./redvoznje-create.component.css']
})
export class RedvoznjeCreateComponent implements OnInit, OnDestroy {

  createRedvoznjeFormGroup: FormGroup;
  private subscription: Subscription  = new Subscription();
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['TransportLineID','FromTo'];
  selectedRows : Array<any> = new Array<any>();
  helperArray: Array<any> = new Array<any>();
  checkBoxArray: Array<any> = new Array<any>();

  constructor(public dialogRef: MatDialogRef<RedvoznjeCreateComponent>,
              private formBuilder: FormBuilder,
              private lineService: LineService,
              private departureService: DepartureService) { 
      this.createRedvoznjeFormGroup = this.formBuilder.group({
        time : ['', Validators.compose([Validators.required])],
        radni: [''],
        subota: [''],
        nedelja: [''] 
      });
  }

  get f() { return this.createRedvoznjeFormGroup.controls; }

  ngOnInit() {
    // this.subscription.add(this.lineService.GetLines().subscribe(data=>{
    //   console.log(data);
    //   this.subscription.add(this.departureService.GetDepartures().subscribe(departures=>{
    //     console.log(departures);
    //     data.forEach(line=>{
    //       line.Clickable = true;
    //       if(departures.includes(line.TransportLineID)){
    //         line.TimeTable = departures[line.TransportLineID].TimeTable;
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
    this.subscription.add(this.departureService.GetDepartures().subscribe(data=>{
      console.log(data);
      data.forEach(d=>d.Clickable=true);
      this.dataSource = new MatTableDataSource(data);
      this.helperArray = [...data];
      console.log(this.helperArray);
    },err=>{
      console.log(err);
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectLine(row: any) {
    console.log(row);
    //zakomentarisano ide u edit kao i u htmlu zakomentarisanu u edit
    //this.subscription.add(this.departureService.GetDeparturesForLine(row.TransportLineID).subscribe(departure=>{
      //console.log(departure);
      // departure.forEach(element => {
        //departure['TimeTable'] = JSON.parse(departure.TimeTable);
      // });

    // },err=>{
    //   console.log(err);
    // }));

    //if je ovde bio
    
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
        console.log(this.helperArray[el]);
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
    // console.log(selected);
    // console.log(this.createRedvoznjeFormGroup.errors);
    // console.log(this.f.radni.value);
    // console.log(this.f.subota.value);
    // console.log(this.f.nedelja.value);
    if(!this.f.radni.value && !this.f.subota.value && !this.f.nedelja.value) {
      this.createRedvoznjeFormGroup.setErrors({ daysInvalid: true});
      //console.log(this.createRedvoznjeFormGroup.errors);
      this.f.radni.reset();
      this.f.subota.reset();
      this.f.nedelja.reset();
      return;
    }
    let radni_dan = this.f.radni.value ? true : false;
    let subota = this.f.subota.value ? true : false;
    let nedelja = this.f.nedelja.value ? true : false;
    console.log(radni_dan);
    console.log(subota);
    console.log(nedelja);
    let validFrom = new Date().toISOString();
    let departure;
    if(radni_dan && nedelja && subota){
      console.log(1);
      departure = Object.assign({
        "TimeTable" : {
          "Radni_dan" : [...this.checkBoxArray],
          "Subota" : [...this.checkBoxArray],
          "Nedelja" : [...this.checkBoxArray]
        }
      });
    }else if(radni_dan && nedelja){
      console.log(2);
      departure = Object.assign({
        "TimeTable" : {
          "Radni_dan" : [...this.checkBoxArray],
          "Nedelja" : [...this.checkBoxArray]
        }
      });
    }else if(radni_dan && subota){
      console.log(3);
      console.log('trebalo bi da udje ovde?!?!');
      departure = Object.assign({
        "TimeTable" : {
          "Radni_dan" : [...this.checkBoxArray],
          "Subota" : [...this.checkBoxArray]
        }
      });
      console.log(departure);
    }else if(subota && nedelja){
      console.log(4);
      departure = Object.assign({
        "TimeTable" : {
          "Subota" : [...this.checkBoxArray],
          "Nedelja" : [...this.checkBoxArray]
        }
      });
    }
    else if(subota) {
      console.log(5);
      departure = Object.assign({
        "TimeTable" : {
          "Subota" : [...this.checkBoxArray]
        }
      });
    }else if(nedelja) {
      console.log(6);
      departure = Object.assign({
        "TimeTable" : {
          "Nedelja" : [...this.checkBoxArray]
        }
      });
    }
    else if(radni_dan){
      console.log(7);
      departure = Object.assign({
        "TimeTable" : {
          "Radni_dan" : [...this.checkBoxArray]
        }
      });
    }

    departure['ValidFrom'] = validFrom;
    departure['TransportLineID'] = this.selectedRows[0].TransportLineID;
    departure['TimeTable'] = JSON.stringify(departure['TimeTable']);
    console.log(departure);


    this.subscription.add(this.departureService.CreateDepartureForLine(departure).subscribe(data=>{
      //console.log(data);
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

  //U EDIT
  // selectDay(selected: any,input: string) {
  //   selected['Day'] = input;
  // }

  // timetable(selected: any, input: string) {
  //   let times = selected.TimeTable[input]
  //   console.log(times);
  //   times.forEach(time=> this.checkBoxArray.push(time));
  //   return selected.TimeTable[input];
  // }
}
