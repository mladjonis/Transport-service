import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class TicketService {
    base_url = "http://localhost:52295";
    apiRoute = "/api/Tickets/";

    constructor(private http: HttpClient){}

    GetAllTickets(): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}`);
    }

    GetCurrentTickets(): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}Current`);
    }

    GetUserType(): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}UserType/`);
    }

    BuyTicket(karta: string,json: any): Observable<any> {
        return this.http.post(`${this.base_url}${this.apiRoute}BuyTicket/${karta}`, json, { "headers" : {'Content-type' : 'application/json'}} );
    }
}