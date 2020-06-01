import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from 'src/app/modeli';
import { HttpClient } from '@angular/common/http';

declare var $;

@Injectable({
  providedIn: 'root'
})

export class BusService {
  base_url = "http://localhost:52295";
  private connection: any;  
  public connectionEstablished: boolean = false; 
  private hub: any;  
  private hubName: string = 'Vehicle';  


  constructor(private http: HttpClient) {
    this.connection = $.hubConnection("http://localhost:52295/");
    this.hub = this.connection.createHubProxy(this.hubName);  
  }

  public startConnection(): Observable<Boolean> {     
    return Observable.create(observer => {
      this.connection.start().done(data => {
        console.log(`Connected to ${data.transport.name} Hub with connection Id = ${data.id}`);
        observer.next(true);
        observer.complete();
      })
      .fail(error => {  
        console.log(`Could not connect to Hub ${this.hubName} on ${this.connection} with error: ${error}`);
        observer.next(false);
        observer.complete(); 
      });  
    });
  }

  public GetBuses(): Observable<any> {
    return this.http.post<any>(this.base_url + "/api/vehicles/updateVehiclePosition",{});
  }

  public registerVehiclesLocations() : Observable<Array<Vehicle>> {
    return Observable.create(observer => {
        this.hub.on('newPositions', (data: string) => {
          // console.log('usaosam u metodu za registrovanje lokacije vozila');
          // console.log(data);
          let vehicles = new Array<Vehicle>();
          //.split('|')
          //data.forEach(vehicle => {
            //let splitedData = vehicle.split(",");
            let splitedData = data.split(",");
            let bus = new Vehicle();
            bus.VehicleID = splitedData[0];
            bus.X = Number.parseFloat(splitedData[1]);
            bus.Y = Number.parseFloat(splitedData[2]);
            bus.TransportLineID = splitedData[3];
            vehicles.push(bus);
          //});
          observer.next(vehicles);
        });  
    });
  }
}