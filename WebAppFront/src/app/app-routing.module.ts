import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedvoznjeComponent } from './redvoznje/redvoznje.component';
import { MrezalinijaComponent } from './mrezalinija/mrezalinija.component';
import { CenovnikComponent } from './cenovnik/cenovnik.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { HomeComponent } from './home/home.component';
import { AdminviewComponent } from './adminview/adminview.component';
import { ProfilComponent } from './profil/profil.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { EmailSendComponent } from './email-send/email-send.component';



const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'prijava', component: PrijavaComponent},
    { path: 'registracija', component: RegistracijaComponent },
    { path: 'redvoznje', component: RedvoznjeComponent },
    { path: 'cenovnik', component: CenovnikComponent },
    { path: 'mrezalinija', component: MrezalinijaComponent },
    { path: 'password-recovery', component: PasswordRecoveryComponent },
    { path: 'email-send', component: EmailSendComponent },
    { path: 'adminview', component: AdminviewComponent, canActivate: [RoleGuard], data: { role: 'Admin'} },
    { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
    { path: 'verify-user', component: VerifyUserComponent, canActivate: [RoleGuard], data: { role: 'Controller'} },

  
    { path: '**', redirectTo: 'home' }
]

@NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [ RouterModule ],
    declarations: []
  })
export class AppRoutingModule { }
