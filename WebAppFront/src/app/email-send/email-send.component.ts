import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailConfirmation } from '../modeli';

@Component({
  selector: 'app-email-send',
  templateUrl: './email-send.component.html',
  styleUrls: ['./email-send.component.css']
})
export class EmailSendComponent implements OnInit, OnDestroy {

  private subscribtion: Subscription = new Subscription();
  emailConfirmation: EmailConfirmation;
  
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.route.queryParams.subscribe(map => map);
    console.log(this.route.snapshot.queryParams); 
    this.emailConfirmation = new EmailConfirmation(this.route.snapshot.queryParams.email,this.route.snapshot.queryParams.token);
    console.log(this.emailConfirmation);
   }

  ngOnInit() {
    this.subscribtion.add(this.userService.ConfirmEmail(this.emailConfirmation).subscribe(response=>{
      console.log(response);
    },err=>{
      console.log(err);
    }));
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

  Login() {
    this.router.navigate(['prijava']);
  }

}
