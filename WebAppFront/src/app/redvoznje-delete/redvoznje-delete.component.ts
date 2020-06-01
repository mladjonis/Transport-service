import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatDialogRef } from '@angular/material';
import { DepartureService } from '../services/departure.service';
import { LineService } from '../services/line.service';

@Component({
  selector: 'app-redvoznje-delete',
  templateUrl: './redvoznje-delete.component.html',
  styleUrls: ['./redvoznje-delete.component.css']
})
export class RedvoznjeDeleteComponent implements OnInit, OnDestroy {

  private subscription: Subscription  = new Subscription();
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['TransportLineID','FromTo'];
  selectedRows : Array<any> = new Array<any>();
  helperArray: Array<any> = new Array<any>();
  days: string[] = ['Radni dan','Subota','Nedelja'];
  selectedDay: string;

  constructor(public dialogRef: MatDialogRef<RedvoznjeDeleteComponent>,
              private departureService: DepartureService,
              private lineService: LineService) { }

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
      data.forEach(d=> {
        d.Clickable=true;
        d['TimeTable'] = JSON.parse(d['TimeTable']);
      });
      //console.log(data);
      this.helperArray = [...data];

      this.dataSource = new MatTableDataSource(data);
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
        //console.log(this.helperArray[el]);
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

  DeleteRedvoznje(selected: any) {
    this.subscription.add(this.departureService.DeleteDeparture(this.selectedRows[0].ID).subscribe(data=>{
      //console.log(data);
      // let idx = this.helperArray.findIndex(a=>a.TransportLineID == this.selectedRows[0].TransportLineID);
      // this.helperArray.splice(idx,1);
      this.selectedRows = [];
      this.helperArray.forEach(item=>{
        item.Clickable = true;
      });
      this.dataSource = new MatTableDataSource(this.helperArray);
    },err=>{
      console.log(err);
    }));
  }


  selectDay(selected: any,input: string) {
    selected['Day'] = input;
  }

  timetable(selected: any, input: string) {
    return selected.TimeTable[input];
  }
}
