import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ChangePasswordBindingModel, UserProfile, PasswordRecovery, ResetPasswordBindingModel, EmailConfirmationRecovery, EmailConfirmation } from '../modeli';

@Injectable()
export class UserService {
    base_url = "http://localhost:52295";

    constructor(private http: HttpClient){}

    GetAllUsers(): Observable<any> {
        return this.http.get<any>(`${this.base_url}/api/Account/GetUsers/`);
    }

    GetUserProfileInfo(id: string): Observable<any> {
      //return this.http.get<any>(`${this.base_url}/api/Account/GetUser/${id}`);
      return this.http.get<any>(`${this.base_url}/api/Account/GetUser`, {params:{ id: id }});
    }

    ChangeTOS(tos: boolean): Observable<any> {
      return this.http.put<any>(`${this.base_url}/api/Account/ChangeTOS`, {params:{ tos: tos }});
    }

    UploadPicture(file: File) : Observable<any> {
      let formData = new FormData();

      if(file != null)
      {
        formData.append("0",file, file.name);
      }
      return this.http.post<any>(this.base_url + "/api/Account/UploadPictures",formData);
    }

    VerifyUser(id: string): Observable<any> {
      //return this.http.put<any>(this.base_url + "/api/Account/VerifyUser/" + id,id);
      return this.http.put<any>(this.base_url + "/api/Account/VerifyUser",id,{params: { id: id }});
    }

    DenyUser(id: string): Observable<any> {
      //return this.http.put<any>(this.base_url + "/api/Account/DenyUser/" + id,id);
      return this.http.put<any>(this.base_url + "/api/Account/DenyUser",id,{params: { id: id }});
    }

    AddToRole(id: string, role: string): Observable<any> {
      //return this.http.put<any>(this.base_url + "/api/Account/AddUserToRole/" + id +"/"+ role, id);
      return this.http.put<any>(this.base_url + "/api/Account/AddUserToRole",id, {params: { id: id, role: role }});
    }

    RemoveFromRole(id: string): Observable<any> {
      //return this.http.put<any>(this.base_url + "/api/Account/RemoveUserFromRole/" + id, id);
      return this.http.put<any>(this.base_url + "/api/Account/RemoveUserFromRole",id,{params: { id: id }});
    }

    GetRoleForUser(id: string): Observable<any> {
      //return this.http.get<any>(this.base_url + "/api/Account/Roles/" + id);
      return this.http.get<any>(this.base_url + "/api/Account/Roles", {params: { id:id }});
    }

    ChangePassword(model: ChangePasswordBindingModel): Observable<any> {
      return this.http.post<any>(this.base_url + "/api/Account/ChangePassword/",model);
    }

    UpdateUserProfile(id: string, userProfile: UserProfile): Observable<any> {
      return this.http.put<any>(this.base_url + "/api/Account/ChageUserProfile/" + id, userProfile);
    }

    DeleteUser(id: string): Observable<any> {
      //return this.http.delete<any>(this.base_url + "/api/Account/DeleteUser/" + id);
      return this.http.delete<any>(this.base_url + "/api/Account/DeleteUser", {params: { id:id }});
    }

    DeleteSelf(): Observable<any> {
      return this.http.delete<any>(this.base_url + "/api/Account/DeleteSelf");
    }

    PasswordRecovery(model: PasswordRecovery): Observable<any> {
      return this.http.post<any>(this.base_url + "/api/Account/ForgotPassword/", model);
    }

    ResetPassword(model: ResetPasswordBindingModel): Observable<any> {
      return this.http.post<any>(this.base_url + "/api/Account/ResetPassword/", model);
    }

    EmailConfirmationResend(model: EmailConfirmationRecovery): Observable<any> {
      return this.http.post<any>(this.base_url + "/api/Account/ResendConfirmationEmail/", model);
    }

    ConfirmEmail(model: EmailConfirmation): Observable<any> {
      return this.http.post<any>(this.base_url + "/api/Account/ConfirmEmail/", model)
    }

    Export(exportType: string): Observable<any> {
      return this.http.get<any>(this.base_url + "/api/Account/Export", {params: {exportType:exportType}})
    }

    ConvertUserTypeIdToString(type: number): string {
      switch (type) {
        case 0:
          return "regularan";
        case 1:
          return "student";
        case 2:
          return "penzioner";
      }
    }

    ConvertTypeOfUserToString(typeOfUser: number): string {
      switch (typeOfUser) {
        case 0:
          return "Obican";
        case 1:
          return "Student";
        case 2:
          return "Penzioner";
      }
    }
}