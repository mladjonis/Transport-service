import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs'
import { Injectable } from '@angular/core';

@Injectable()
export class TokenInterceptor implements HttpInterceptor{

    constructor(){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        let jwt = localStorage.jwt; //token
        if(jwt){    
            req = req.clone({
                setHeaders:{
                    "Authorization": "Bearer " + jwt
                }
            });
        }   
        return next.handle(req);
    }
}