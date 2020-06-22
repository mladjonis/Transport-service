import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, 
        MatToolbarModule, MatInputModule, 
        MatCardModule, MatIconModule,
        MatDividerModule, MatTooltipModule,
        MatSelectModule,MatTableModule, 
        MatTabsModule, MatExpansionModule, 
        MatSlideToggleModule, MatStepperModule,
        MatNativeDateModule, MatDatepickerModule,
        MatTreeModule, MatDialogModule, 
        MatRadioModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'


import { AuthHttpService } from './services/auth.service';
import { TokenInterceptor } from './token.interceptor';
import { DepartureService } from './services/departure.service';
import { LineService } from './services/line.service';
import { StationsService } from './services/stations.service';
import { TicketService } from './services/ticket.service';
import { UserTypeService } from './services/usertype.service';
import { UserService } from './services/user.service';
import { DataSharingService } from './services/data-sharing.service';
import { BlogService } from './services/blog.service';
import { PricelistService } from './services/pricelist.service';
import { PriceFinalService } from './services/pricefinal.service';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RedvoznjeComponent } from './redvoznje/redvoznje.component';
import { MrezalinijaComponent } from './mrezalinija/mrezalinija.component';
import { CenovnikComponent } from './cenovnik/cenovnik.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { HomeComponent, CreateBlogDialog } from './home/home.component';
import { AdminviewComponent } from './adminview/adminview.component';
import { ProfilComponent } from './profil/profil.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RedvoznjeCreateComponent } from './redvoznje-create/redvoznje-create.component';
import { RedvoznjeMenuComponent } from './redvoznje-menu/redvoznje-menu.component';
import { RedvoznjeEditComponent } from './redvoznje-edit/redvoznje-edit.component';
import { RedvoznjeDeleteComponent } from './redvoznje-delete/redvoznje-delete.component';
import { PricelistMenuComponent } from './pricelist-menu/pricelist-menu.component';
import { CenovnikEditComponent } from './cenovnik-edit/cenovnik-edit.component';
import { CenovnikCreateComponent } from './cenovnik-create/cenovnik-create.component';
import { CenovnikDeleteComponent } from './cenovnik-delete/cenovnik-delete.component';
import { MapAdminOperationsComponent } from './map-admin-operations/map-admin-operations.component';
import { AdminUserOperationsComponent } from './admin-user-operations/admin-user-operations.component';
import { AdminUsersMenuComponent } from './admin-users-menu/admin-users-menu.component';
import { AdminUsersDeleteComponent } from './admin-users-delete/admin-users-delete.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { EmailModalResendComponent } from './email-modal-resend/email-modal-resend.component';
import { EmailSendComponent } from './email-send/email-send.component';
import { DeleteUserModalComponent } from './delete-user-modal/delete-user-modal.component';


import { ReplaceUnderscorePipe } from './pipes/replace-underscore';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import sr from '@angular/common/locales/sr-Latn';
import { registerLocaleData } from '@angular/common';


registerLocaleData(sr);


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RedvoznjeComponent,
    MrezalinijaComponent,
    CenovnikComponent,
    RegistracijaComponent,
    HomeComponent,
    AdminviewComponent,
    ProfilComponent,
    VerifyUserComponent,
    PrijavaComponent,
    ReplaceUnderscorePipe,
    CreateBlogDialog,
    CenovnikEditComponent,
    PricelistMenuComponent,
    CenovnikCreateComponent,
    CenovnikDeleteComponent,
    RedvoznjeCreateComponent,
    RedvoznjeEditComponent,
    RedvoznjeDeleteComponent,
    RedvoznjeMenuComponent,
    MapAdminOperationsComponent,
    AdminUserOperationsComponent,
    AdminUsersMenuComponent,
    AdminUsersDeleteComponent,
    ForgetPasswordComponent,
    PasswordRecoveryComponent,
    EmailModalResendComponent,
    EmailSendComponent,
    DeleteUserModalComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatTabsModule,
    MatTableModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTreeModule,
    MatDialogModule,
    MatRadioModule,
    RxReactiveFormsModule,
    HttpClientModule
  ],
  entryComponents: [
    CreateBlogDialog,
    PricelistMenuComponent,
    CenovnikEditComponent,
    CenovnikCreateComponent,
    CenovnikDeleteComponent,
    RedvoznjeCreateComponent,
    RedvoznjeEditComponent,
    RedvoznjeDeleteComponent,
    RedvoznjeMenuComponent,
    MapAdminOperationsComponent,
    AdminUserOperationsComponent,
    AdminUsersMenuComponent,
    AdminUsersDeleteComponent,
    ForgetPasswordComponent,
    EmailModalResendComponent,
    DeleteUserModalComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: LOCALE_ID, useValue: "sr-Latn" },
    AuthHttpService,
    DepartureService,
    LineService,
    StationsService,
    TicketService,
    UserTypeService,
    UserService,
    DataSharingService,
    BlogService,
    PriceFinalService,
    PricelistService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }