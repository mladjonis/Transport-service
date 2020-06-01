import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class LineService {
    base_url = "http://localhost:52295";
    apiRoute = "/api/TransportLines/";

    constructor(private http: HttpClient){}

    GetLines() : Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}`);
    }

    GetLine(lineId: string): Observable<any> {
        return this.http.get<any>(`${this.base_url}${this.apiRoute}${lineId}`);
    }

    EditLine(lineId: string, line: any): Observable<any> {
        return this.http.put<any>(`${this.base_url}${this.apiRoute}${lineId}`,line);
    }

    CreateLine(line: any): Observable<any> {
        return this.http.post<any>(`${this.base_url}${this.apiRoute}`,line);
    }

    DeleteLine(lineId: string): Observable<any> {
        return this.http.delete<any>(`${this.base_url}${this.apiRoute}${lineId}`);
    }
}