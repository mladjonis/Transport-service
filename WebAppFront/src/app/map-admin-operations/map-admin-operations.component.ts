import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { LineService } from '../services/line.service';
import { StationsService } from '../services/stations.service';
import { Subscription } from 'rxjs';
import {} from 'googlemaps';
import { TransportLine, LinePoint, Station } from '../modeli';
import { DeleteMenu } from './delete-menu';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

interface Color {
  color: string;
  line: string;
}

@Component({
  selector: 'app-map-admin-operations',
  templateUrl: './map-admin-operations.component.html',
  styleUrls: ['./map-admin-operations.component.css']
})
export class MapAdminOperationsComponent implements OnInit, OnDestroy {

  private subscription: Subscription  = new Subscription();
  displayedColumns: string[] = ['TransportLineID','FromTo'];
  lines : Array<TransportLine> = new Array<TransportLine>();
  selectedRows : Array<any> = new Array<any>();
  dataSource : MatTableDataSource<any>;
  line: TransportLine;
  helperArray: Array<any> = new Array<any>();
  lineInAdding: Array<any> = new Array<any>();
  lineInProgress: any;
  processingLines: Array<any> = new Array<any>();
  stationFormGroup: FormGroup;
  lineFormGroup: FormGroup;
  success: boolean = false;

  //map props
  @ViewChild('map',{static:true}) mapEl: ElementRef;
  map: google.maps.Map;
  mapProperties = {
    center: new google.maps.LatLng(45.248636, 19.833549),
    zoom: 14
  };
  polylineOptions : any;
  colors: Array<Color> = new Array<Color>();
  selectedLineCoordinates: Array<google.maps.LatLng> = new Array<google.maps.LatLng>();
  windowInfo: any;
  

  constructor(public dialogRef: MatDialogRef<MapAdminOperationsComponent>,
              private lineService: LineService,
              private stationsService: StationsService,
              public ngZone: NgZone,
              private formBuilder: FormBuilder) 
  {
    this.stationFormGroup = this.formBuilder.group({
      name : ['', Validators.compose([Validators.required])]
    });
    this.lineFormGroup = this.formBuilder.group({
      fromTo : ['', Validators.compose([Validators.required])],
      direction : ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.lineService.GetLines().subscribe(lines => {
      lines.forEach(line=>{
        line.Clickable=true;
      });
      console.log('linije',lines);
      this.lines = lines;
      this.dataSource = new MatTableDataSource(this.lines);
      this.helperArray = [...lines];
      err => console.log(err);
    });
    window["angularComponentRef"] = { component: this, zone: this.ngZone };

    this.map = new google.maps.Map(this.mapEl.nativeElement, this.mapProperties);
  }

  hexColorGenerator = () => '#'+Math.floor(Math.random()*16777215).toString(16);

  lineCallbackForMapsManipulations(polyline: google.maps.Polyline, idx: number): void {
    let path = polyline.getPath();
    this.selectedLineCoordinates = [];
    this.selectedRows[idx].LinePointsCoordinates = polyline;
    let len = path.getLength();
    this.selectedRows[idx].LinePoints = [];
    this.selectedLineCoordinates = [];   
    for (let i = 0; i < len; i++) {
      let latLng = path.getAt(i).toUrlValue(8).split(',');
      //this.selectedLineCoordinates.push(path.getAt(i).toUrlValue(8));
      this.selectedLineCoordinates.push(new google.maps.LatLng(Number(latLng[0]),Number(latLng[1])));
      this.selectedRows[idx].LinePoints.push(new LinePoint(Number(latLng[0]),Number(latLng[1]),this.line.TransportLineID));
    }
  }

  selectLine(row: any){
    if(row.Selected)
    {
      row.Selected = false;
      let index = this.selectedRows.findIndex(x => x.Id == row.Id);
      row.LinePointsCoordinates.setMap(null);
      //this.selectedLineCoordinates.setMap(null);
      
      row.Stations = [];
      delete row.Stations;
      row.Markers.forEach(marker => {
        marker.setMap(null);
      });
      delete row.Markers;
      this.selectedRows.splice(index,1);
      let idx =this.colors.findIndex(x=>x.line == row.TransportLineID);
      this.colors.splice(idx,1);
      for(let el in this.helperArray){
        if(this.helperArray[el].TransportLineID != row.TransportLineID){
          this.helperArray[el].Clickable = true;
        }
      }
    } 
    else
    {
      row.Selected = true;
      row.Markers = [];
      //row.selectedLineCoordinates = [];
      this.selectedRows.push(row);
      this.drawLine(row);
      for(let el in this.helperArray){
        if(this.helperArray[el].TransportLineID != row.TransportLineID){
          this.helperArray[el].Clickable = false;
        }
      }
    }
    this.dataSource = new MatTableDataSource(this.helperArray);
  }

  drawLineInAdding(line:any){
    this.line = line;
    let googleArray = this.populateGoogleLonLatArray(this.line);
    let color = this.hexColorGenerator();
    let poly = new google.maps.Polyline({
      path: googleArray,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: 4,
      editable: true
    });
    google.maps.event.addListener(poly.getPath(), "set_at", ()=>{
      this.lineCallbackForMapsManipulations(poly,idx);
      // let path = poly.getPath();
      // this.selectedLineCoordinates = [];
      // this.selectedRows[idx].LinePointsCoordinates = poly;
      // let len = path.getLength();
      // this.selectedRows[idx].LinePoints = [];
      // this.selectedLineCoordinates = [];   
      // for (let i = 0; i < len; i++) {
      //   let latLng = path.getAt(i).toUrlValue(8).split(',');
      //   //this.selectedLineCoordinates.push(path.getAt(i).toUrlValue(8));
      //   this.selectedLineCoordinates.push(new google.maps.LatLng(Number(latLng[0]),Number(latLng[1])));
      //   this.selectedRows[idx].LinePoints.push(new LinePoint(Number(latLng[0]),Number(latLng[1]),this.line.TransportLineID));
      // }
    });
    google.maps.event.addListener(poly.getPath(), "dragend", ()=>{
      this.lineCallbackForMapsManipulations(poly,idx);
      // let path = poly.getPath();
      // this.selectedLineCoordinates = [];
      // this.selectedRows[idx].LinePointsCoordinates = poly;
      // let len = path.getLength();
      // this.selectedRows[idx].LinePoints = [];
      // this.selectedLineCoordinates = [];   
      // for (let i = 0; i < len; i++) {
      //   let latLng = path.getAt(i).toUrlValue(8).split(',');
      //   //this.selectedLineCoordinates.push(path.getAt(i).toUrlValue(8));
      //   this.selectedLineCoordinates.push(new google.maps.LatLng(Number(latLng[0]),Number(latLng[1])));
      //   this.selectedRows[idx].LinePoints.push(new LinePoint(Number(latLng[0]),Number(latLng[1]),this.line.TransportLineID));
      // }
    });
    google.maps.event.addListener(poly.getPath(), "insert_at", ()=>{
      this.lineCallbackForMapsManipulations(poly,idx);
      // let path = poly.getPath();
      // this.selectedLineCoordinates = [];
      // this.selectedRows[idx].LinePointsCoordinates = poly;
      // let len = path.getLength();
      // this.selectedRows[idx].LinePoints = [];
      // this.selectedLineCoordinates = [];   
      // for (let i = 0; i < len; i++) {
      //   let latLng = path.getAt(i).toUrlValue(8).split(',');
      //   //this.selectedLineCoordinates.push(path.getAt(i).toUrlValue(8));
      //   this.selectedLineCoordinates.push(new google.maps.LatLng(Number(latLng[0]),Number(latLng[1])));
      //   this.selectedRows[idx].LinePoints.push(new LinePoint(Number(latLng[0]),Number(latLng[1]),this.line.TransportLineID));
      // }
    });
    google.maps.event.addListener(poly.getPath(), "remove_at", ()=>{
      this.lineCallbackForMapsManipulations(poly,idx);
      // let path = poly.getPath();
      // this.selectedLineCoordinates = [];
      // this.selectedRows[idx].LinePointsCoordinates = poly;
      // let len = path.getLength();
      // this.selectedRows[idx].LinePoints = [];
      // this.selectedLineCoordinates = [];         
      // for (let i = 0; i < len; i++) {
      //   let latLng = path.getAt(i).toUrlValue(8).split(',');
      //   //this.selectedLineCoordinates.push(path.getAt(i).toUrlValue(8));
      //   this.selectedLineCoordinates.push(new google.maps.LatLng(Number(latLng[0]),Number(latLng[1])));
      //   this.selectedRows[idx].LinePoints.push(new LinePoint(Number(latLng[0]),Number(latLng[1]),this.line.TransportLineID));
      // }
    });

    let idx = this.selectedRows.findIndex(a=>a.TransportLineID == this.line.TransportLineID);
    var deleteMenu = new DeleteMenu(this.map,false,[],this.selectedRows[idx].LinePoints);

    google.maps.event.addListener(poly, 'rightclick', function(e) {
      // Check if click was on a vertex control point
      if (e.vertex == undefined) {
        return;
      }
      deleteMenu.open(this.map, poly.getPath(), e.vertex);
    });

    this.colors.push({'color' : color,'line' : this.line.TransportLineID});
    
    
    this.selectedRows[idx].LinePointsCoordinates = poly;
    this.selectedRows[idx].LinePointsCoordinates.setMap(this.map);
  }

  Success(): boolean {
    return this.success;
  }

  drawLine(row: any) {
    this.lineService.GetLine(row['TransportLineID']).subscribe(line =>{
      this.stationsService.GetStationsOnLine(row['TransportLineID']).subscribe(stations => {
        line.Stations = stations;
        this.line = line;
        row['Stations'] = stations;
        console.log('linija iz apija',this.line);
        let googleArray = this.populateGoogleLonLatArray(this.line);
        let color = this.hexColorGenerator();
        let poly = new google.maps.Polyline({
          path: googleArray,
          geodesic: true,
          strokeColor: color,
          strokeOpacity: 1,
          strokeWeight: 4,
          editable: true
        });


          google.maps.event.addListener(poly.getPath(), "set_at", ()=>{
            this.lineCallbackForMapsManipulations(poly,idx);
            // let path = poly.getPath();
            // this.selectedLineCoordinates = [];
            // this.selectedRows[idx].LinePointsCoordinates = poly;
            // let len = path.getLength();
            // this.selectedRows[idx].LinePoints = [];
            // this.selectedLineCoordinates = [];   
            // for (let i = 0; i < len; i++) {
            //   let latLng = path.getAt(i).toUrlValue(8).split(',');
            //   //this.selectedLineCoordinates.push(path.getAt(i).toUrlValue(8));
            //   this.selectedLineCoordinates.push(new google.maps.LatLng(Number(latLng[0]),Number(latLng[1])));
            //   this.selectedRows[idx].LinePoints.push(new LinePoint(Number(latLng[0]),Number(latLng[1]),this.line.TransportLineID));
            // }
          });
          google.maps.event.addListener(poly.getPath(), "dragend", ()=>{
            this.lineCallbackForMapsManipulations(poly,idx);
            // let path = poly.getPath();
            // this.selectedLineCoordinates = [];
            // this.selectedRows[idx].LinePointsCoordinates = poly;
            // let len = path.getLength();
            // this.selectedRows[idx].LinePoints = [];
            // this.selectedLineCoordinates = [];   
            // for (let i = 0; i < len; i++) {
            //   let latLng = path.getAt(i).toUrlValue(8).split(',');
            //   //this.selectedLineCoordinates.push(path.getAt(i).toUrlValue(8));
            //   this.selectedLineCoordinates.push(new google.maps.LatLng(Number(latLng[0]),Number(latLng[1])));
            //   this.selectedRows[idx].LinePoints.push(new LinePoint(Number(latLng[0]),Number(latLng[1]),this.line.TransportLineID));
            // }
          });
          google.maps.event.addListener(poly.getPath(), "insert_at", ()=>{
            this.lineCallbackForMapsManipulations(poly,idx);
            // let path = poly.getPath();
            // this.selectedLineCoordinates = [];
            // this.selectedRows[idx].LinePointsCoordinates = poly;
            // let len = path.getLength();
            // this.selectedRows[idx].LinePoints = [];
            // this.selectedLineCoordinates = [];   
            // for (let i = 0; i < len; i++) {
            //   let latLng = path.getAt(i).toUrlValue(8).split(',');
            //   //this.selectedLineCoordinates.push(path.getAt(i).toUrlValue(8));
            //   this.selectedLineCoordinates.push(new google.maps.LatLng(Number(latLng[0]),Number(latLng[1])));
            //   this.selectedRows[idx].LinePoints.push(new LinePoint(Number(latLng[0]),Number(latLng[1]),this.line.TransportLineID));
            // }
          });
          google.maps.event.addListener(poly.getPath(), "remove_at", ()=>{
            this.lineCallbackForMapsManipulations(poly,idx);
            // let path = poly.getPath();
            // this.selectedLineCoordinates = [];
            // this.selectedRows[idx].LinePointsCoordinates = poly;
            // let len = path.getLength();
            // this.selectedRows[idx].LinePoints = [];
            // this.selectedLineCoordinates = [];         
            // for (let i = 0; i < len; i++) {
            //   let latLng = path.getAt(i).toUrlValue(8).split(',');
            //   //this.selectedLineCoordinates.push(path.getAt(i).toUrlValue(8));
            //   this.selectedLineCoordinates.push(new google.maps.LatLng(Number(latLng[0]),Number(latLng[1])));
            //   this.selectedRows[idx].LinePoints.push(new LinePoint(Number(latLng[0]),Number(latLng[1]),this.line.TransportLineID));
            // }
          });

        

        let idx = this.selectedRows.findIndex(a=>a.TransportLineID == this.line.TransportLineID);
        var deleteMenu = new DeleteMenu(this.map,false,[],this.selectedRows[idx].LinePoints);

        google.maps.event.addListener(poly, 'rightclick', function(e) {
          // Check if click was on a vertex control point
          if (e.vertex == undefined) {
            return;
          }
          deleteMenu.open(this.map, poly.getPath(), e.vertex);
        });

        this.colors.push({'color' : color,'line' : this.line.TransportLineID});
        
        
        this.selectedRows[idx].LinePointsCoordinates = poly;
        this.selectedRows[idx].LinePointsCoordinates.setMap(this.map);


        //crtanje stajalista
        if(this.line.Stations.length > 0){
          this.line.Stations.forEach(station => {
            this.drawStation(station,this.line.TransportLineID,idx,false);
          });
          err=> console.log(err);
        }
      });
      err=> console.log(err);
    });
    err=> console.log(err);
  }

  populateGoogleLonLatArray(line: TransportLine): Array<google.maps.LatLng> {
    let lonLatArray = new Array<google.maps.LatLng>();
    line.LinePoints.forEach(item=>{
      lonLatArray.push(new google.maps.LatLng(item.X,item.Y))
    });
    return lonLatArray;
  }

  public Edit() {
    this.windowInfo = null;
    let infoWindow = document.getElementById('station-name');
    this.windowInfo = infoWindow.innerHTML;
    console.log(this.windowInfo);
  }

  drawStation(station: any, transportLineId: string, index: number, addingNewFlag: boolean) {
    let iconTemplatePath = "../../assets/";
    if(transportLineId.endsWith("A")){
      iconTemplatePath = `${iconTemplatePath}busMarker1.png`;
    } else {
      iconTemplatePath = `${iconTemplatePath}busMarker2.png`;
    }

    let marker;
    let name;
    let x;
    let y;
    if(addingNewFlag == false){
      marker = new google.maps.Marker({
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(station.Station.X,station.Station.Y),
        title: station.Station.Name,
        icon: iconTemplatePath
      });
      name = station.Station.Name;
      x = station.Station.X;
      y = station.Station.Y;
    }else {
      marker = new google.maps.Marker({
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(station.X,station.Y),
        title: station.Name,
        icon: iconTemplatePath
      });
      name = station.Name;
      x = station.X;
      y = station.Y;
    }

    let infoWindow = new google.maps.InfoWindow();
    marker.addListener('click', () => {
      let content = `<div id="station-name">
                      <div id="station-n" contenteditable="true"><b>${name}</b></div>
                      <div id="station-x">Longitude ${y}</div>
                      <div id="station-y">Latitude ${x}</div>
                    </div>`;
      if(this.windowInfo){
       content = this.windowInfo;
      }
      let infoContent: string = '<button onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.Edit();})">Edit station name</button>';
      content += infoContent;

      infoWindow.setContent(`${content}`);
      infoWindow.open(this.map, marker);
    });

    marker.addListener('dragend', () => {  
      let splittedInfo = infoWindow.getContent().toString().split('\n');
      let toSet = `<div id="station-name">
          ${splittedInfo[1]}
          <div id="station-x">Longitude ${marker.getPosition().lng()}</div>
          <div id="station-y">Latitude ${marker.getPosition().lat()}</div>
          <button onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.Edit();})">Edit station name</button>
        </div>`;

      infoWindow.setContent(toSet);
 

      if(this.windowInfo){
        marker.setTitle(this.windowInfo.toString().split('\n')[0].substring(this.windowInfo.toString().split('\n')[0].lastIndexOf("<b>")+3,this.windowInfo.toString().split('\n')[0].lastIndexOf("</b>")));
      }else {
        marker.setTitle(splittedInfo[1].substring(splittedInfo[1].lastIndexOf("<b>")+3,splittedInfo[1].lastIndexOf("</b>")));
      }
      //data.split('\n')[0].substring(data.split('\n')[0].lastIndexOf("<b>")+3,data.split('\n')[0].lastIndexOf("</b>"))
      let idxForModify = this.selectedRows[index].Markers.findIndex(x=>x.getPosition().equals(marker.getPosition()));
      this.selectedRows[index].Markers[idxForModify] = marker;
    });

    let deleteMenu = new DeleteMenu(this.map,true,this.selectedRows[index].Markers,[]);
    // this.markersFromDeleteMethod = deleteMenu.markersOnSelectedLine;
    // console.log(deleteMenu.markersOnSelectedLine);
    
    google.maps.event.addListener(marker,'rightclick',e=>{
      if (e.tb.target.nodeName != 'IMG') {
        return;
      }
      deleteMenu.open(this.map, marker, e.latLng);
    });
    
    this.selectedRows[index].Markers.push(marker);
    marker.setMap(this.map);
  }


  EditLine(): void {
    this.selectedRows[0].MarkersStorage = [...JSON.parse(localStorage.getItem('markers'))];
    //this.selectedRows[0].LinePoints = [...JSON.parse(localStorage.getItem('lines'))];
    this.selectedRows[0].Stations = [];
    let helper : any;
    // if(this.selectedRows[0].MarkersStorage.length < this.selectedRows[0].Markers.length)
    // {
    //   //brisan je neki marker pronaci koji 
    //   // this.selectedRows[0].Markers.forEach(marker=>{
    //   //   if(this.selectedRows[0].MarkersStorage.getPosition())
    //   // });
    // }
    console.log(this.selectedRows);
    this.selectedRows[0].Markers.forEach(data=>{
      //let parseStation = data.split(',');
      // this.selectedRows[0].Stations.push(new Station(parseStation[0],parseStation[0],Number(parseStation[1]),Number(parseStation[2])));
      this.selectedRows[0].Stations.push(new Station(data.getTitle(),data.getTitle(),data.getPosition().lat(),data.getPosition().lng()));
    });
    helper = this.selectedRows[0].LinePointsCoordinates;
    let helperMarker = this.selectedRows[0].Markers;
    //console.log(helper);
    // console.log(helper);
    // console.log(this.selectedRows[0].LinePointsCoordinates);
    // delete this.selectedRows[0].Markers;
    delete this.selectedRows[0].Markers;
    delete this.selectedRows[0].LinePointsCoordinates;
    this.subscription.add(this.lineService.EditLine(this.selectedRows[0].TransportLineID,this.selectedRows[0]).subscribe(
      data=>{
        this.success = true;
        this.selectedRows[0].LinePointsCoordinates = helper;
        this.selectedRows[0].Markers = helperMarker;
        let idx = this.helperArray.findIndex(a=>a.TransportLineID == this.selectedRows[0].TransportLineID);
        this.helperArray[idx] = this.selectedRows[0];
        this.dataSource = new MatTableDataSource(this.helperArray);
      }, err=>{
        this.success = false;
        console.log(err);
      }
    ));
  }

  DeleteLine(): void {
    this.subscription.add(this.lineService.DeleteLine(this.selectedRows[0].TransportLineID).subscribe(
      data=>{
        console.log(data);
        let idx = this.helperArray.findIndex(a=>a.TransportLineID == this.selectedRows[0].TransportLineID);
        this.helperArray.splice(idx,1);
        this.helperArray.forEach(item=>{
          item.Clickable = true;
        });
        this.selectedRows[0].LinePointsCoordinates.setMap(null);
        this.selectedRows[0].Markers.forEach(marker => {
          marker.setMap(null);
        });
        delete this.selectedRows[0].Markers;
        //this.selectedRows.splice(index,1);
        let colorIdx =this.colors.findIndex(x=>x.line == this.selectedRows[0].TransportLineID);
        this.colors.splice(colorIdx,1);
        this.selectedRows = [];
        this.dataSource = new MatTableDataSource(this.helperArray);
      }, err=>{
        console.log(err);
      }
    ));
  }

  AddStation(): void {

    if(this.stationFormGroup.controls.name.invalid){
      console.log('samo ako ima errora');
      return;
    }

    let nameStation = this.stationFormGroup.controls.name.value;
    let idx = this.selectedRows.findIndex(a=>a.TransportLineID == this.selectedRows[0].TransportLineID);
    let stationCoord = new google.maps.LatLng(45.248636, 19.833549);
    let station = new Station(nameStation,nameStation,45.248636,19.833549);
    this.drawStation(station,this.selectedRows[0].TransportLineID,idx,true);
    this.stationFormGroup.controls.name.reset();
  }

  AddLine(): void {
    if(this.lineFormGroup.controls.direction.invalid || this.lineFormGroup.controls.fromTo.invalid){
      console.log('samo ako ima errora');
      return;
    }
    let firstPoint = new google.maps.LatLng(45.25334117773775,19.83071658728029);
    let secondPoint = new google.maps.LatLng(45.25264631457829,19.832466164832322);


    let firstLinePoint = new LinePoint(firstPoint.lat(),firstPoint.lng(),this.lineFormGroup.controls.direction.value);
    let secondLinePoint = new LinePoint(secondPoint.lat(),secondPoint.lng(),this.lineFormGroup.controls.direction.value);
    this.lineInAdding.push(firstLinePoint);
    this.lineInAdding.push(secondLinePoint);

    this.lineInProgress = new TransportLine();
    this.lineInProgress.TransportLineID = this.lineFormGroup.controls.direction.value;
    this.lineInProgress.FromTo = this.lineFormGroup.controls.fromTo.value;
    this.lineInProgress.LinePoints = [...this.lineInAdding];
    this.lineInProgress.Stations = [];
    this.lineInProgress.Markers = [];
    this.lineInProgress.Clickable = true;
    this.lineInProgress.Selected = true;
    this.selectedRows.push(this.lineInProgress);
    this.helperArray.push(this.lineInProgress);
    for(let el in this.helperArray){
      if(this.helperArray[el].TransportLineID != this.lineInProgress.TransportLineID){
        this.helperArray[el].Clickable = false;
      }
    }
    this.dataSource = new MatTableDataSource(this.helperArray);

    this.drawLineInAdding(this.lineInProgress);
    this.lineFormGroup.controls.direction.reset();
    this.lineFormGroup.controls.fromTo.reset();
  }

  SaveLine(): void {
    console.log(this.selectedRows[0]);
    this.subscription.add(this.lineService.CreateLine(this.selectedRows[0]).subscribe(data=>{
      console.log(data);
      this.helperArray.push(this.selectedRows[0]);
      this.dataSource = new MatTableDataSource(this.helperArray);
    },err=>{
      console.log(err);
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    window["angularComponentRef"] = null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
