import { Component, OnInit, OnDestroy } from '@angular/core';
import { DepartureService } from '../services/departure.service';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-redvoznje',
  templateUrl: './redvoznje.component.html',
  styleUrls: ['./redvoznje.component.css']
})
export class RedvoznjeComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['TransportLineID','FromTo'];
  selectedRows : Array<any> = new Array<any>();
  days: string[] = ['Radni dan','Subota','Nedelja'];
  lines: Array<any> = new Array<any>();
  selectedDay: string;

  constructor(private departureService: DepartureService) { }


  

  ngOnInit() {
    this.departureService.GetDepartures().subscribe(data=> {
      console.log(data);
      data.forEach(element => {
        this.lines.push(element);
      });

      this.lines.forEach(element => {
        element['TimeTable'] = JSON.parse(element.TimeTable);
      });
      this.dataSource = new MatTableDataSource(data);
      err=> console.log(err);
    });
  }

  ngOnDestroy() {

  }

  applyFilter(filterValue: any) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any): boolean =>{
      return data.TransportLines.FromTo.trim().toLowerCase().includes(filterValue) || data.TransportLines.TransportLineID.trim().toLowerCase().includes(filterValue);
    }
    this.dataSource.filter = filterValue;
  }

  //mozda prepraviti kasnije za izlistavanje na mapi ali mozda i ne..
  selectLine(row: any){
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

  selectDay(selected: any,input: string) {
    selected['Day'] = input;
  }

  timetable(selected: any, input: string) {
    return selected.TimeTable[input];
  }
}
