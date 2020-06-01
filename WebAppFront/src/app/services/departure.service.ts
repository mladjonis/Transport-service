import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class DepartureService {
    base_url = "http://localhost:52295";
    apiRoute = "/api/Departures/";

    constructor(private http: HttpClient){}

    GetDepartures() : Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}`);
    }

    GetNullDepartures(): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}GetNullDepartures`);
    }
    GetNotNullDepartures(): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}GetNotNullDepartures`);
    }

    GetDeparturesForLine(lineId: string) : Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}GetDeparturesByLine/${lineId}`);
    }

    CreateDeparture(departure:any) : Observable<any> {
        return this.http.post<any>(`${this.base_url}${this.apiRoute}`,departure);
    }

    CreateDepartureForLine(departure:any) : Observable<any> {
        return this.http.put<any>(`${this.base_url}${this.apiRoute}PutDeparturesForLine`,departure);
    }

    DeleteDeparture(id: number) : Observable<any> {
        return this.http.delete<any>(`${this.base_url}${this.apiRoute}${id}`);
    }
}