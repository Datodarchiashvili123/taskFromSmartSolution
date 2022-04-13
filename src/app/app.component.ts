import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "../environments/environment";
import { Role } from "./models/role";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myJira';
  constructor(private http: HttpClient) {


    // let test = this.http.get(`${environment.apiUrl}/users`);
    // test.pipe(
    //   map(x=> console.log(x))
    // ).subscribe();
    //

    //getEmployees call
    // this.getEmployees(1).subscribe(x=> console.log(x, ' lalala')  );

  }


  // getEmployees(id: number){
  //
  //  return  this.http.get(`${environment.apiUrl}?organisationId=${id}` );
  //
  // }


  // getUsers(){
  //    this.http.get(`${environment.apiUrl}/users`).pipe(
  //     map(x => console.log(x))).subscribe();
  //    console.log('lallaa');
  //   return;
  // }
  //
  // createUser(){
  //   this.http.put(`${environment.apiUrl}/create`,
  //     {id: 3, email: 'test1', password: 'test', userType: Role.Admin, token: ' fake-jwt-token'}).subscribe();
  // }



}
