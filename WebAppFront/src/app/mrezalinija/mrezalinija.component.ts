import { Component, OnInit,OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import {} from 'googlemaps';
import { TransportLine, Vehicle,
        Station, StationsOnLine} from '../modeli';
import { LineService } from '../services/line.service';
import { StationsService } from '../services/stations.service';
import { AuthHttpService } from '../services/auth.service';
import { BusService } from '../services/bus.service';


interface Color {
  color: string;
  line: string;
}

interface PolylineOptions {
  path: Array<google.maps.LatLng>;
  geodesic: boolean;
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
}


@Component({
  selector: 'app-mrezalinija',
  templateUrl: './mrezalinija.component.html',
  styleUrls: ['./mrezalinija.component.css']
})
export class MrezalinijaComponent implements OnInit,OnDestroy {

  constructor(private http: AuthHttpService, 
              private bus: BusService, 
              private lineService: LineService,
              private stationsService: StationsService) { }

  //
  lines : Array<TransportLine> = new Array<TransportLine>();
  mapProperties = {
    center: new google.maps.LatLng(45.248636, 19.833549),
    //novo
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 14
  };
  polylineOptions : PolylineOptions;
  @ViewChild('map',{static:true}) mapEl: ElementRef;
  map: google.maps.Map;
  selectedRows : Array<any> = new Array<any>();
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = ['TransportLineID','FromTo'];
  colors: Array<Color> = new Array<Color>();
  hubConnectionEstablished: Boolean = false;
  private subscription: Subscription = new Subscription();
  line: TransportLine = null;


  ngOnInit() {
    this.subscription.add(this.lineService.GetLines().subscribe(lines => {
      this.lines = lines;
      lines.forEach(line=>{
        line.VehiclesMarkers;
      });
      console.log(lines);
      this.dataSource = new MatTableDataSource(this.lines);
      err => console.log(err);
    }));

    this.map = new google.maps.Map(this.mapEl.nativeElement, this.mapProperties);

    this.registerHub();
    this.initHubConnection();

    this.subscription.add(this.bus.GetBuses().subscribe(data=>{
      console.log('asdasdasdasd');
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  
  private initHubConnection(){
    this.subscription.add(this.bus.startConnection().subscribe(e => {
      this.hubConnectionEstablished = e;
    }));
  }
  
  private registerHub() {
    this.subscription.add(this.bus.registerVehiclesLocations().subscribe(
      data => {
        console.log('data iz subscribe metode',data);
        data.forEach(bus => {
          this.VehicleMarker(bus);
        });
      }, err=> {
        console.log(err);
      }
    ));
  }

  hexColorGenerator = () => '#'+Math.floor(Math.random()*16777215).toString(16);

  selectLine(row: any){
    if(row.Selected)
    {
      row.Selected = false;
      let index = this.selectedRows.findIndex(x => x.Id == row.Id);
      row.LinePoints.setMap(null);
      row.Markers.forEach(marker => {
        marker.setMap(null);
      });
      // if(row.VehiclesMarkers.length > 0){
        row.VehiclesMarkers.setMap(null);
      //   row.VehiclesMarkers.forEach(vehicleMarker=>{
      //     vehicleMarker.setMap(null);
      //   });
      // }
      delete row.VehiclesMarkers;
      delete row.Markers;
      this.selectedRows.splice(index,1);
      let idx = this.colors.findIndex(x=>x.line == row.TransportLineID);
      console.log(row);
      console.log(idx);
      console.log(this.colors);
      this.colors.splice(idx,1);
      console.log(this.colors);
    } else
    {
      row.Selected = true;
      row.Markers = [];
      this.selectedRows.push(row);
      this.drawLine(row);
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any): boolean =>{
      console.log(data);
      return data.FromTo.trim().toLowerCase().includes(filterValue) || data.TransportLineID.trim().toLowerCase().includes(filterValue);
    }
    this.dataSource.filter = filterValue;
  }

  drawLine(row: any) {
    this.lineService.GetLine(row['TransportLineID']).subscribe(line =>{
      this.stationsService.GetStationsOnLine(row['TransportLineID']).subscribe(stations => {
        line.Stations = stations;
        this.line = line;
        row['Stations'] = stations;
        let googleArray = this.populateGoogleLonLatArray(this.line);
        let color = this.hexColorGenerator();
        this.polylineOptions = {
          path: googleArray,
          geodesic: true,
          strokeColor: color,
          strokeOpacity: 1,
          strokeWeight: 4
        }
        this.colors.push({'color' : color,'line' : this.line.TransportLineID});
        
        
        let idx = this.selectedRows.findIndex(a=>a.TransportLineID == this.line.TransportLineID);
        this.selectedRows[idx].LinePoints = new google.maps.Polyline(this.polylineOptions);
        this.selectedRows[idx].LinePoints.setMap(this.map);


        //crtanje stajalista
        if(this.line.Stations.length > 0){
          this.line.Stations.forEach(station => {
            this.drawBusStopOnLine(station,this.line.TransportLineID,idx);
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

  drawBusStopOnLine(station: any, transportLineId: string, index: number) {
    let iconTemplatePath = "../../assets/";
    if(transportLineId.endsWith("A")){
      iconTemplatePath = `${iconTemplatePath}busStop1.png`;
    } else {
      iconTemplatePath = `${iconTemplatePath}busStop2.png`;
    }

    let marker = new google.maps.Marker({
      map: this.map,
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(station.Station.X,station.Station.Y),
      title: station.Name,
      icon: iconTemplatePath
    });

    let infoWindow = new google.maps.InfoWindow();
    marker.addListener('click', () => {
      let content = "";
      content += `<div><b>${station.Station.Name}</b></div>`;
      content += `<div>Longitude ${station.Station.X}</div>`;
      content += `<div>Latitude ${station.Station.Y}</div>`;
      infoWindow.setContent(`${content}`);
      infoWindow.open(this.map, marker);
    });

    this.selectedRows[index].Markers.push(marker);

    marker.setMap(this.map);
  }

  private VehicleMarker(vehicle: Vehicle) {
    let idx = this.selectedRows.findIndex(a=>a.TransportLineID == vehicle.TransportLineID);
    if(this.selectedRows.length > 0) {
      if(!this.selectedRows[idx].VehiclesMarkers) {
        let markerIconPath = "../../assets/busMarker1.png";
        let marker = new google.maps.Marker({
          map: this.map,
          draggable: false,
          position: new google.maps.LatLng(vehicle.X,vehicle.Y),
          title: vehicle.TransportLineID,
          icon: markerIconPath
        });

        let infoWindow = new google.maps.InfoWindow();
          marker.addListener('click', () => {
            let content = "";
            content += `<div><b>${vehicle.VehicleID}</b></div>`;
            infoWindow.setContent(`${content}`);
            infoWindow.open(this.map, marker);
          });
        
        this.selectedRows[idx].VehiclesMarkers=marker;
        marker.setMap(this.map);
        
      } else {
        this.selectedRows[idx].VehiclesMarkers.setZIndex(100);
        this.selectedRows[idx].VehiclesMarkers.setPosition(new google.maps.LatLng(vehicle.X, vehicle.Y));
      }
    }
  }
}
