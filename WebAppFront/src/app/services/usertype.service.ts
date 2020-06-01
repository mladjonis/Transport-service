import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class UserTypeService {
    base_url = "http://localhost:52295";

    constructor(private http: HttpClient){}

    GetAllUserTypes(): Observable<any> {
        return this.http.get<any>(`${this.base_url}/api/UserTypes/`);
    }
}