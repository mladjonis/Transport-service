import { Component, OnInit, Injectable, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthHttpService } from '../services/auth.service';
import { DataSharingService } from '../services/data-sharing.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

@Injectable()
export class HeaderComponent implements OnInit {
  
  role: string;
  name: string;
  isUserLoggedIn: boolean = false;
  rememberMe: boolean = false;
  constructor(private router: Router, private authService: AuthHttpService,
              private dataSharingService: DataSharingService) { 

    this.dataSharingService.loggedInName.subscribe( value => {
      this.isUserLoggedIn = value.loggedIn;
      this.role = value.role;
      this.name = value.name;
      this.rememberMe = value.rememberMe;
    });
   }

  ngOnInit() {
    this.dataSharingService.roleShare.subscribe(val => {
      if(val.role){
        this.role = val.role;
        this.name = val.name;
        this.isUserLoggedIn = true;
      }
    });
  }


  
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    if(!this.rememberMe){
      this.LogOut();
    }
  }

  LogOut(){
    this.authService.LogOut().subscribe(data=>{
      localStorage.removeItem('jwt');
      this.isUserLoggedIn = false;
      this.role = "";
      this.name = "";
      this.router.navigate(['/home']);
    }, err=>{
      console.log(err);
    });
  }
}
