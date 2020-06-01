import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class BlogService {
    base_url = "http://localhost:52295";

    constructor(private http: HttpClient){}

    GetBlogs() : Observable<any> {
        return this.http.get<any>(this.base_url + "/api/BlogPosts");
    }

    DeleteBlog(blogId: number) : Observable<any> {
        return this.http.delete<any>(this.base_url + "/api/BlogPosts/" + blogId);
    }

    EditBlog(blogId: number, BlogPost: any) : Observable<any> {
        return this.http.put<any>(this.base_url + "/api/BlogPosts/" + blogId, BlogPost);
    }

    CreateBlog(BlogPost: any) : Observable<any> {
        return this.http.post<any>(this.base_url + "/api/BlogPosts",BlogPost);
    }
}