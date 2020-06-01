import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthHttpService } from 'src/app/services/auth.service';
import { DataSharingService } from '../services/data-sharing.service';
import { BlogService } from '../services/blog.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlogPost } from '../modeli';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ AuthHttpService ]
})

export class HomeComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthHttpService,
              private dataSharingService: DataSharingService, 
              private blogService: BlogService,
              public dialog: MatDialog) { }

  role : string;
  name : string;
  blogs : Array<any> = new Array<any>();

  ngOnInit() {
    this.role = this.authService.GetRole();
    this.name = this.authService.GetName();
    
    this.dataSharingService.roleShare.next({'role':this.role ,'name':this.name });

    this.blogService.GetBlogs().subscribe(data=>{
      this.blogs = data;
    },err=>{
      console.log(err);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openDialog() : void {
    const dialogRef = this.dialog.open(CreateBlogDialog, {
      maxWidth: '600px',
      height: '500px',
      width: '600px',
      maxHeight: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      let blog = new BlogPost(
        result.title,
        result.content,
        new Date().toISOString(),
        this.name);
 
      this.subscription.add(this.blogService.CreateBlog(blog).subscribe(data=>{
        this.blogs.push(blog);
      },err=>{
        console.log(err);
      }));
    }
    });
  }

  Delete(blogId: number) {
    this.subscription.add(this.blogService.DeleteBlog(blogId).subscribe(data=>{
      let blogIndex = this.blogs.findIndex(blog => blog.ID == blogId);
      this.blogs.splice(blogIndex,1);
    }, err=>{
      console.log(err);
    }));
  }

  Edit(blogId: number) {

    let blog = this.blogs.find(blog => blog.ID == blogId);
    this.subscription.add(this.blogService.EditBlog(blogId,blog).subscribe(data=>{
      let div = document.getElementById(blogId.toString());
      blog.BlogText = div.innerText;
    },err=>{
      console.log(err);
    }));
  }
}

@Component({
  selector: 'create-blog-dialog',
  templateUrl: 'create-blog-dialog.html'
})
export class CreateBlogDialog implements OnDestroy {


  createBlogFormGroup: FormGroup;
  
  constructor(public dialogRef: MatDialogRef<CreateBlogDialog>,
            private formBuilder: FormBuilder)
  {
    this.createBlogFormGroup = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnDestroy() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
