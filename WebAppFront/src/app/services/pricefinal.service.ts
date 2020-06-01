import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class PriceFinalService {
    base_url = "http://localhost:52295";
    apiRoute = "/api/PriceFinals/";

    constructor(private http: HttpClient){}

    GetCurrentPriceFinals(): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}Current`);
    }

    GetAllPriceFinals(): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}`);
    }

    GetPriceFinal(id: number): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}${id}`);
    }

    EditPriceFinal(id: number, priceFinal: any): Observable<any> {
        return this.http.put<any>(`${this.base_url}${this.apiRoute}${id}`,priceFinal);
    }

    CreatePriceFinal(pricelistId: number, priceFinalArray: any): Observable<any> {
        return this.http.post<any>(`${this.base_url}${this.apiRoute}${pricelistId}`,JSON.parse(priceFinalArray));
    }

    DeletePriceFinal(id: number): Observable<any> {
        return this.http.delete<any>(`${this.base_url}${this.apiRoute}${id}`);
    }
}