import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AuthHttpService } from 'src/app/services/auth.service';
import { PayPalPaymentDetails } from '../modeli';
import { MatTableDataSource } from '@angular/material';
import { TicketService } from '../services/ticket.service';
import { ThemePalette } from '@angular/material/core';
import { UserTypeService } from '../services/usertype.service';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

declare let paypal: any;

//OVDE PROMENITI POZIVE KUPOVINE KARTE IZ AUTH U TICKET SERVIS
//OBRISATI kada se salju parametri tip kupca to ne treba
//dodati poziv ga nekom apiju za kurs eura umesto ovog zakucanog

@Component({
  selector: 'app-cenovnik',
  templateUrl: './cenovnik.component.html',
  styleUrls: ['./cenovnik.component.css']
})
export class CenovnikComponent implements OnInit, OnDestroy {

  //
  private subscription: Subscription = new Subscription();
  dataSource: MatTableDataSource<any>;
  acceptedTOS: boolean;
  displayedColumns: string[] = ['TicketType', 'Price', 'UserTypeStringID'];
  selectedRows: Array<any> = new Array<any>();
  color: ThemePalette = 'accent';
  checked = false;
  mesecnaValidna: boolean = true;
  godisnjaValidna: boolean = true;
  expiresSoon: boolean = false;
  tipKarte : string;
  tipKupca : string = "";
  //


  karte : string[] = ["regularna"];
  kupci : string[] = ["regularan"];

  kursEura : number = 0.00850;
  email : string;
  retVal : boolean;
  role : any;
  userType: string = "regularan";

  cenaRSD : number;
  cenaEur : number;
  cenaEura : string;
  kupljenaKartaID : number;
  kupljenaKartaKupljena : any;
  kupljenaKartaIstice : any;
  kupljenaKartaKarta : string;
  @ViewChild('divPaypal',{static: false}) divPaypal : ElementRef;


  paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox: '<your-sandbox-key here>',
      production: '<your-production-key here>'
    },
    commit: true,
    locale: 'en_US',
    style: {
      size: 'medium',
      shape: 'pill',
      label: 'paypal',
      color: 'blue'
    },
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          intent: 'sale',
           transactions: [
             { 
              amount: 
                { total: this.cenaEur.toFixed(2), currency: 'EUR' },
              item_list: {
                items:[{
                 name: this.tipKarte,
                 quantity: 1,
                 price: this.cenaEur.toFixed(2),
                 currency:'EUR'
                }]
              }
            }
           ]
        }
      });
    },
    onAuthorize: (data, actions) => {           
      return actions.payment.execute()
        .then(payPalPaymentDetails =>  {
          let paymentDetailsObj = new PayPalPaymentDetails(payPalPaymentDetails);
          this.buyTicket(this.tipKarte,JSON.stringify(paymentDetailsObj));
        });
    },
    onError: (err) => {
      console.log(err);
    }
  };

  private IsTicketValid(ticket: any): boolean {
    let dateNow = new Date();
    let expires = new Date(ticket.Expires);
    let fiveDaysInMilliseconds = 432000000;
    if(expires.getMilliseconds() <= dateNow.getMilliseconds()) {
      if(Math.abs(expires.getMilliseconds() - dateNow.getMilliseconds()) <= fiveDaysInMilliseconds){
        this.expiresSoon = true;
        return true;
      }
      return true;
    }
    else{
      return false;
    }
  }

  private CanBuyCard(userTickets: any) {
    userTickets.forEach(ticket=>{
      if(ticket.TicketType == "godisnja"){
        if(!this.IsTicketValid(ticket)){
          console.log(' godisnja nije validna');
          this.godisnjaValidna = false;
        }
      }else if (ticket.TicketType == "mesecna") {
        if(!this.IsTicketValid(ticket)){
          console.log('mesecna nije validna');
          this.mesecnaValidna = false;
        }
      }
    });
  }

  constructor(private http: AuthHttpService, private ticketService: TicketService
              ,private usertypeService: UserTypeService, private userService: UserService
              ) 
              { }
  
  ngOnInit() {
    let role = this.http.GetRole();
    let name = this.http.GetName();

    //islo je GetAllTickets
    this.subscription.add(this.ticketService.GetCurrentTickets().subscribe(data=> {
      data.splice(4);

      let dataTemplate = JSON.parse(JSON.stringify(data));
      let returnData = JSON.parse(JSON.stringify(dataTemplate));
      this.subscription.add(this.usertypeService.GetAllUserTypes().subscribe(usertypes => {
        dataTemplate.forEach(itemData => 
          {
            itemData.User.UserType.TypeOfUser = 1;
            itemData.PriceFinal.Price = itemData.PriceFinal.Price * usertypes[usertypes.findIndex(x => x.TypeOfUser == 1)].Coefficient;
          });
        dataTemplate = [...data, ...dataTemplate];
        returnData = JSON.parse(JSON.stringify(dataTemplate));
        returnData.forEach(itemData => 
          {
            itemData.User.UserType.TypeOfUser = 2;
            itemData.PriceFinal.Price = itemData.PriceFinal.Price * usertypes[usertypes.findIndex(x => x.TypeOfUser == 2)].Coefficient;
          });
        returnData = [...dataTemplate, ...returnData];
        returnData.splice(12);
        data = [...returnData];
        if(!name){
          data[0].Buyable = true;
        }
        else {
        this.subscription.add(this.userService.GetUserProfileInfo(name).subscribe(user=>{
          if(role == "AppUser" && user.AcceptedTOS == true){
            this.acceptedTOS = true;
            user.UserTypeStringID = this.userService.ConvertTypeOfUserToString(user.UserType.TypeOfUser);
            if(user.Status != "verified"){
              data[0].Buyable = true;
            }
            else if(user.Status == "verified" && user.UserTypeStringID == "Student"){
              for(let i=4,j=0; i<8; i++, j++){
                this.CanBuyCard(user.Tickets);
                data[i].Buyable = true;
                if(user.Tickets.filter(ticket=> ticket.TicketType == "mesecna" || ticket.TicketType == "godisnja").length > 0){
                  if(this.godisnjaValidna && this.expiresSoon){
                    data[3].Buyable = true;
                  }else {
                    data[3].Buyable = false;
                  }
                  if( this.mesecnaValidna && this.expiresSoon){
                    data[2].Buyable = true;
                  }else {
                    data[2].Buyable = false;
                  }
                }
                let asa = data[i];
                data[i]=data[j];
                data[j]=asa;
              }
            }
            else if(user.Status == "verified" && user.UserTypeStringID == "Obican"){
              for(let i=0,j=0;i<4;i++,j++){
                this.CanBuyCard(user.Tickets);
                data[i].Buyable = true;
                if(user.Tickets.filter((ticket:any)=> ticket['TicketType'] == "mesecna" || ticket['TicketType'] == "godisnja").length > 0){
                  if(this.godisnjaValidna && this.expiresSoon){
                    data[3].Buyable = true;
                  }else {
                    data[3].Buyable = false;
                  }
                  if( this.mesecnaValidna && this.expiresSoon){
                    data[2].Buyable = true;
                  }else {
                    data[2].Buyable = false;
                  }
                }
              }
            }
            else if(user.Status == "verified" && user.UserTypeStringID == "Penzioner"){
              for(let i=8,j=0;i<12;i++,j++){
                this.CanBuyCard(user.Tickets);
                data[i].Buyable = true;
                if(user.Tickets.filter(ticket=> ticket.TicketType == "mesecna" || ticket.TicketType == "godisnja").length > 0){
                  if(this.godisnjaValidna && this.expiresSoon){
                    data[3].Buyable = true;
                  }else {
                    data[3].Buyable = false;
                  }
                  if( this.mesecnaValidna && this.expiresSoon){
                    data[2].Buyable = true;
                  }else {
                    data[2].Buyable = false;
                  }
                }
                let asa = data[i];
                data[i]=data[j];
                data[j]=asa;
              }
            }
          } else if(role == "AppUser" && user.AcceptedTOS == false) {
            // staviti obavestenje zasto korisnik ne moze da kupi kartu
            this.acceptedTOS = false;
          }
        },err=>{
          console.log(err);
        }));
      }
        data.forEach(elementData => {
          elementData.User.UserTypeStringID = this.userService.ConvertUserTypeIdToString(elementData.User.UserType.TypeOfUser);
        });
        this.dataSource = new MatTableDataSource(data);
      }));
    },err=>console.log(err)))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleRadioButton(checked: any) {
    this.checked = !checked;

    if(this.checked){
      this.dataSource.filterPredicate = (data,filter): boolean => {
        return data.Buyable == true;
      };
      this.dataSource.filter = 'Buyable';
    }else {
      this.dataSource.filterPredicate = (data,filter):boolean => {
        return true;
      }
      this.dataSource.filter = 'all';
    }
  }

  selectTicket(row: any){
    console.log(row);
    if(row.Selected)
    {
      row.Selected = false;
      let index = this.selectedRows.findIndex(x => x.Id == row.Id);
      this.selectedRows.splice(index,1);
    } else
    {
      row.Selected = true;
      this.selectedRows.push(row);
      this.tipKarte = row.TicketType;
      this.cenaRSD = row.PriceFinal.Price;
      this.cenaEur = this.cenaRSD * this.kursEura;
      this.cenaEura = this.cenaEur.toFixed(2);
      
    }
    this.togglePaypalButton();
  }


  //toggle paypal button
  private togglePaypalButton() {
    if(!document.querySelector(".paypal-button")){
      paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
    }
    if(this.divPaypal.nativeElement.hidden == true)
    {
      this.divPaypal.nativeElement.hidden = false;
    }else{
      this.divPaypal.nativeElement.hidden = true;
    }
  }

  applyFilter(filterValue: any) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any): boolean =>{
      return data.User.UserTypeStringID.includes(filterValue) || data.PriceFinal.Price.toString().includes(filterValue)
        || data.TicketType.includes(filterValue);
    }
    this.dataSource.filter = filterValue;
  }


  buyTicket(karta: string, json: any) {
    this.ticketService.BuyTicket(karta,json).subscribe( karta => {
      this.kupljenaKartaID = karta.TicketID;
      this.kupljenaKartaKupljena = Date.parse(karta.BoughtAt);
      this.kupljenaKartaIstice = karta.Expires.slice(0,16).replace('T',' ');
      this.kupljenaKartaKarta = karta.TicketType;
      this.cenaRSD = karta.PriceFinal.Price;

      err=> console.log(err);
    });
  }
}
