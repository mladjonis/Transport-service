import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class PricelistService {
    base_url = "http://localhost:52295";
    apiRoute = "/api/Pricelists/";

    constructor(private http: HttpClient){}

    GetCurrentPricelist(): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}Current`);
    }

    GetPastPricelists(): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}Past`)
    }

    GetAllPricelists(): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}`);
    }

    GetPricelist(id: number): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}${id}`);
    }

    EditPricelist(id: number, pricelist: any): Observable<any> {
        return this.http.put<any>(`${this.base_url}${this.apiRoute}${id}`,pricelist);
    }

    CreatePricelist(pricelist: any): Observable<any> {
        return this.http.post<any>(`${this.base_url}${this.apiRoute}`,pricelist);
    }

    DeletePricelist(id: number): Observable<any> {
        return this.http.delete<any>(`${this.base_url}${this.apiRoute}${id}`);
    }
}