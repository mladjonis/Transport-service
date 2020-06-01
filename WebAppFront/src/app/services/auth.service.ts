import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegUser } from 'src/app/modeli';
import { Observable,} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthHttpService {   

  base_url = "http://localhost:52295";

  constructor(private http: HttpClient){}

  user: string
  tempStr : string[]
    logIn(username: string, password: string): Observable<any>{
        let data = `username=${username}&password=${password}&grant_type=password`;
        let httpOptions : {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }
        return this.http.post<any>(this.base_url + "/oauth/token", data, httpOptions).pipe(map(
            data => {
            localStorage.setItem('jwt',data.access_token);
        },
            err=> console.log(err)
        ));
    }

    LogOut(): Observable<any> {
        return this.http.post<any>(`${this.base_url}/api/Account/Logout`,{});
    }

    Register(data: RegUser,file: File) : Observable<any>{
        let formData = new FormData();
        if(file != null)
            formData.append("0",file, file.name);

        for(var k in data)
            formData.append(k,data[k]);

        return this.http.post<any>(this.base_url + "/api/Account/Register", formData);
    }


    //leave this
    private parseToken(token:any): any {
        let jwtData = token.split('.')[1];
        let decodedJwtJsonData = window.atob(jwtData);
        let decodedJwtData = JSON.parse(decodedJwtJsonData);
        return decodedJwtData;
    }

    GetRole(): string {
        let token = this.GetToken();
        if (token == null) {
            return "";
        }
        else {
            let parsedToken = this.parseToken(token);
            return parsedToken.role;
        }
    }

    GetName(): string {
        let token = this.GetToken();
        if (token == null) {
            return "";
        }else {
            let parsedToken = this.parseToken(token);
            return parsedToken.nameid;
        }
    }

    GetRealName():any {
        let token = this.GetToken();
        if(token == null){
            return "";
        }else {
            let parsedToken = this.parseToken(token);
            return parsedToken;
        }
    }
    
    GetToken(): any {
        return localStorage.getItem('jwt');
    }
}