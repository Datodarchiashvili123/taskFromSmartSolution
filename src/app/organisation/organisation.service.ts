import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Status } from "../models/status";
import { AuthenticationService } from "../services/authentication.service";
import { Task } from "../models/task";

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {


  }
  getOrganisation(){
    const currentUserId = this.authenticationService.currentUserValue.organisationId;
    return this.http.get(`${ environment.apiUrl}?organisationById=${currentUserId}`);
  }

  getTasks(): Observable<any>{
    const currentUserId = this.authenticationService.currentUserValue.organisationId;
    return this.http.get(`${ environment.apiUrl}/tasks?taskById=${currentUserId}`);
  }

  getTasksByStatus(status : Status):Observable<Task[]>{
      return this.getTasks().pipe(
        map(tasks => {
          let tasksByStatus: Task[] = tasks.filter( (task: Task) => task.status == status );
          return tasksByStatus;
        })
      )
  }

}
