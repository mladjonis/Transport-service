export class UserProfile {
    Name: string
    Surname: string
    Email: string
    Adress: string
    DateOfBirth: string
    UserType: string

    constructor(name: string, surname: string, email: string, adress: string, date: string, userType: string){
        this.Name = name;
        this.Surname = surname;
        this.Email = email;
        this.Adress = adress;
        this.DateOfBirth = date;
        this.UserType = userType;
    }
}

export class ChangePasswordBindingModel {
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;

    constructor(oldPW: string, newPW: string, confPW: string){
        this.OldPassword = oldPW;
        this.NewPassword = newPW;
        this.ConfirmPassword = confPW;
    }
}

export class BlogPost {
    Title: string;
    BlogText: string;
    PublishedAt: string;
    UserID: string;

    constructor(title: string, text: string, published: string, user: string){
        this.Title = title;
        this.BlogText = text;
        this.PublishedAt = published;
        this.UserID = user;
    }
}


export class RegUser{
    name: string
    surname: string
    password: string
    confirmPassword: string
    email: string
    date: string
    usertype : string
    address : string
    tos: boolean

    constructor(name: string, surname: string, email: string, password: string, confirm: string, date: string, address: string, usertype: string, tos: boolean){
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirm;
        this.date = date;
        this.address = address;
        this.usertype = usertype;
        this.tos = tos;
    }

}

export class Vehicle {
    VehicleID : string;
    TransportLineID : string;
    TransportLine : TransportLine;
    X : number;
    Y : number;
}

export class Station {
    StationID : number;
    Address : string;
    Name : string;
    X : number;
    Y : number;
    StationsOnLines : Array<StationsOnLine> = new Array();

    constructor(addr: string, name: string, x: number, y: number) {
        this.Address = addr;
        this.Name = name;
        this.X = x;
        this.Y = y;
    }
}

export class StationsOnLine {
    StationsOnLineID : number;
    StationID : number;
    Station : Station;
    TransportLineID : string;
    TransportLine : TransportLine;
}

export class LinePoint {
    LinePointID : number;
    X : number;
    Y : number;
    TransportLineID : string;
    TransportLine : TransportLine;

    constructor(x: number, y:number, transporLineId: string){
        this.LinePointID = 0;
        this.X = x;
        this.Y = y;
        this.TransportLineID = transporLineId;
    }
}


export class TransportLine {
    TransportLineID : string;
    FromTo : string;
    Vehicles : Array<Vehicle> = new Array();
    Stations: Array<Station> = new Array();
    LinePoints: Array<LinePoint> = new Array();
}


export class Pricelist {
    ID: number
    From: Date
    To: Date
}

export class PriceFinal {
    Price: number

    constructor(price: number){
        this.Price = price;
    }
}

export class PasswordRecovery {
    Email: string
    
    constructor(email: string){
        this.Email = email;
    }
}

export class EmailConfirmationRecovery {
    Email: string
    
    constructor(email: string){
        this.Email = email;
    }
}

export class EmailConfirmation {
    Email: string
    Token: string
    
    constructor(email: string, token: string){
        this.Email = email;
        this.Token = token;
    }
}

export class ResetPasswordBindingModel {
    NewPassword: string
    ConfirmPassword: string
    Email: string
    Token: string

    constructor(newPass: string, confirmPass: string, email: string, token: string){
        this.NewPassword = newPass;
        this.ConfirmPassword = confirmPass;
        this.Email = email;
        this.Token = token;
    }
}

export class DataLinks {
    CsvData: string;
    CsvPayPal: string;
    PdfData: string;

    constructor(csvData: string, csvPayPal: string, pdfData: string){
        this.CsvData = csvData;
        this.CsvPayPal = csvPayPal;
        this.PdfData = pdfData;
    }
}

export class PayPalPaymentDetails {
    Id : string
    Intent : string
    State : string
    Cart : string
    CreateTime : string
    PayerPaymentMethod : string
    PayerStatus : string
    PayerEmail : string
    PayerFirstName : string
    PayerMiddleName : string
    PayerLastName : string
    PayerId : string
    PayerCountryCode : string
    ShippingAddressRecipientName : string
    ShippingAddressStreet : string
    ShippingAddressCity : string
    ShippingAddressState : string
    ShippingAddressPostalCode :number
    ShippingAddressCountryCode : string
    TransactionsAmountTotal : number
    TransactionsAmountCurrency : string
    TransactionsDetailsSubtotal : number
    TransactionsDetailsShipping : number
    TransactionsDetailsHandlingFee : number
    TransactionsDetailsInsurance : number
    TransactionsShippingDiscount : number
    TransactionsItemListItemsName : string
    TransactionsItemListItemsPrice : number
    TransactionsItemListItemsCurrencty : string
    TransactionsItemListItemsQuantity : number
    TransactionsItemListItemsTax : number

    constructor(jsonData : any) {
        this.Id = jsonData['id'];
        this.Intent = jsonData['intent'];
        this.State = jsonData['state'];
        this.Cart = jsonData['cart'];
        this.CreateTime = jsonData['create_time'];
        this.PayerPaymentMethod = jsonData['payer']['payment_method'];
        this.PayerStatus = jsonData['payer']['status'];
        this.PayerEmail = jsonData['payer']['payer_info']['email'];
        this.PayerFirstName = jsonData['payer']['payer_info']['first_name'];
        this.PayerMiddleName = jsonData['payer']['payer_info']['middle_name'];
        this.PayerLastName = jsonData['payer']['payer_info']['last_name'];
        this.PayerId = jsonData['payer']['payer_info']['payer_id'];
        this.PayerCountryCode = jsonData['payer']['payer_info']['country_code'];
        this.ShippingAddressRecipientName = jsonData['payer']['payer_info']['shipping_address']['recipient_name'];
        this.ShippingAddressStreet = jsonData['payer']['payer_info']['shipping_address']['line1'];
        this.ShippingAddressCity = jsonData['payer']['payer_info']['shipping_address']['city'];
        this.ShippingAddressState = jsonData['payer']['payer_info']['shipping_address']['state'];
        this.ShippingAddressCountryCode = jsonData['payer']['payer_info']['shipping_address']['country_code'];
        this.ShippingAddressPostalCode = jsonData['payer']['payer_info']['shipping_address']['postal_code'];
        this.TransactionsAmountTotal = jsonData['transactions']['0']['amount']['total'];
        this.TransactionsAmountCurrency = jsonData['transactions']['0']['amount']['currency'];
        this.TransactionsDetailsSubtotal = jsonData['transactions']['0']['amount']['details']['subtotal'];
        this.TransactionsDetailsShipping = jsonData['transactions']['0']['amount']['details']['shipping'];
        this.TransactionsDetailsHandlingFee = jsonData['transactions']['0']['amount']['details']['handling_fee'];
        this.TransactionsDetailsInsurance = jsonData['transactions']['0']['amount']['details']['insurance'];
        this.TransactionsDetailsShipping = jsonData['transactions']['0']['amount']['details']['shipping_discount'];
        this.TransactionsItemListItemsName = jsonData['transactions']['0']['item_list']['items']['0']['name'];
        this.TransactionsItemListItemsPrice = jsonData['transactions']['0']['item_list']['items']['0']['price'];
        this.TransactionsItemListItemsCurrencty = jsonData['transactions']['0']['item_list']['items']['0']['currency'];
        this.TransactionsItemListItemsQuantity = jsonData['transactions']['0']['item_list']['items']['0']['quantity'];
        this.TransactionsItemListItemsTax = jsonData['transactions']['0']['item_list']['items']['0']['tax'];
    }
}

export class PayPalPaymentDetailsEncrypted {

    Id : string
    IntentEncrypted : string
    StateEncrypted : string
    CartEncrypted : string
    CreateTimeEncrypted : string
    PayerPaymentMethodEncrypted : string
    PayerStatusEncrypted : string
    PayerEmailEncrypted : string
    PayerFirstNameEncrypted : string
    PayerMiddleNameEncrypted : string
    PayerLastNameEncrypted : string
    PayerIdEncrypted : string
    PayerCountryCodeEncrypted : string
    ShippingAddressRecipientNameEncrypted : string
    ShippingAddressStreetEncrypted : string
    ShippingAddressCityEncrypted : string
    ShippingAddressStateEncrypted : string
    ShippingAddressPostalCodeEncrypted : number
    ShippingAddressCountryCodeEncrypted : string
    TransactionsAmountTotalEncrypted : number
    TransactionsAmountCurrencyEncrypted : string
    TransactionsDetailsSubtotalEncrypted : number
    TransactionsDetailsShippingEncrypted : number
    TransactionsDetailsHandlingFeeEncrypted : number
    TransactionsDetailsInsuranceEncrypted : number
    TransactionsShippingDiscountEncrypted : number
    TransactionsItemListItemsNameEncrypted : string
    TransactionsItemListItemsPriceEncrypted : number
    TransactionsItemListItemsCurrencyEncrypted : string
    TransactionsItemListItemsQuantityEncrypted : number
    TransactionsItemListItemsTaxEncrypted : number


    constructor(pp: PayPalPaymentDetails) {
        this.Id = pp.Id;
        this.IntentEncrypted = pp.Intent;
        this.StateEncrypted = pp.State;
        this.CartEncrypted = pp.Cart;
        this.CreateTimeEncrypted = pp.CreateTime;
        this.PayerPaymentMethodEncrypted = pp.PayerPaymentMethod;
        this.PayerStatusEncrypted = pp.PayerStatus;
        this.PayerEmailEncrypted = pp.PayerEmail;
        this.PayerFirstNameEncrypted = pp.PayerFirstName;
        this.PayerMiddleNameEncrypted = pp.PayerMiddleName;
        this.PayerLastNameEncrypted = pp.PayerLastName;
        this.PayerIdEncrypted = pp.PayerId;
        this.PayerCountryCodeEncrypted = pp.PayerCountryCode;
        this.ShippingAddressRecipientNameEncrypted = pp.ShippingAddressRecipientName;
        this.ShippingAddressStreetEncrypted = pp.ShippingAddressStreet;
        this.ShippingAddressCityEncrypted = pp.ShippingAddressStreet;
        this.ShippingAddressStateEncrypted = pp.ShippingAddressState;
        this.ShippingAddressPostalCodeEncrypted = pp.ShippingAddressPostalCode;
        this.ShippingAddressCountryCodeEncrypted = pp.ShippingAddressCountryCode;
        this.TransactionsAmountTotalEncrypted = pp.TransactionsAmountTotal;
        this.TransactionsAmountCurrencyEncrypted = pp.TransactionsAmountCurrency;
        this.TransactionsDetailsSubtotalEncrypted = pp.TransactionsDetailsSubtotal;
        this.TransactionsDetailsShippingEncrypted = pp.TransactionsDetailsShipping;
        this.TransactionsDetailsHandlingFeeEncrypted = pp.TransactionsDetailsHandlingFee;
        this.TransactionsDetailsInsuranceEncrypted = pp.TransactionsDetailsInsurance;
        this.TransactionsShippingDiscountEncrypted = pp.TransactionsShippingDiscount;
        this.TransactionsItemListItemsNameEncrypted = pp.TransactionsItemListItemsName;
        this.TransactionsItemListItemsPriceEncrypted = pp.TransactionsItemListItemsPrice;
        this.TransactionsItemListItemsCurrencyEncrypted = pp.TransactionsItemListItemsCurrencty;
        this.TransactionsItemListItemsQuantityEncrypted = pp.TransactionsItemListItemsQuantity;
        this.TransactionsItemListItemsTaxEncrypted = pp.TransactionsItemListItemsTax;
    }


}