import { Component, OnInit, OnDestroy} from '@angular/core';
import { UserService } from '../services/user.service';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css']
})
export class VerifyUserComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = ['Email','Status','UserTypeStringID'];
  selectedRows : Array<any> = new Array<any>();
  helperTableArray: Array<any> = new Array<any>();

  constructor(private userService: UserService) { }

  ngOnInit() {

    this.subscription.add(this.userService.GetAllUsers().subscribe(data=>{
      let filteredData = data.filter(item=>item.Id!='admin' && item.Id!='controller' && item.Id!='appu');
      filteredData.forEach(elementData => {
        elementData.Files = `http://localhost:52295/imgs/users/${elementData.Id}/${elementData.Files}`;
        elementData.UserTypeStringID = this.userService.ConvertUserTypeIdToString(elementData.UserType.TypeOfUser);
      });
      this.helperTableArray = filteredData;
      this.dataSource = filteredData;
    }));
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


  selectLine(row: any){
    if(row.Selected)
    {
      row.Selected = false;
      let index = this.selectedRows.findIndex(x => x.Id == row.Id);
      this.selectedRows.splice(index,1);
    } else
    {
      row.Selected = true;
      this.selectedRows.push(row);
    }
  }

  Verify(selected: any) {
    this.subscription.add(this.userService.VerifyUser(selected.Id).subscribe(data=>{
      this.helperTableArray.forEach(item => {
        if(item.Id == selected.Id){
          item.Status = "verified";
        }
      });
      this.dataSource = new MatTableDataSource(this.helperTableArray);
    }, err=>{
      console.log(err);
    }));
  }

  Deny(selected: any) {
    this.subscription.add(this.userService.DenyUser(selected.Id).subscribe(data=>{
      this.helperTableArray.forEach(item => {
        if(item.Id == selected.Id){
          item.Status = "not verified";
        }
      });
      this.dataSource = new MatTableDataSource(this.helperTableArray);
    }, err=>{
      console.log(err);
    }));
  }
}
