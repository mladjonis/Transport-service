import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataSharingService {
    public loggedInName: BehaviorSubject<any> = new BehaviorSubject<any>(
        { 
            'role': '', 
            'name': '', 
            'loggedIn': false,
            'rememberMe': false 
        }
    );

    public roleShare: BehaviorSubject<any> = new BehaviorSubject<any>({
        'role': '',
        'name': ''
    });
}