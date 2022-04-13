import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, mergeMap, shareReplay } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Status } from "../models/status";
import { Task, TaskUser } from "../models/task";
import { User } from "../models/user";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class TasksStoryService {


  private subject = new BehaviorSubject<TaskUser[]>([]);

  tasks$: Observable<TaskUser[]> = this.subject.asObservable();


  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) {
    this.getTasks();
  }

   getTasks() {
    const currentUserId = this.authenticationService.currentUserValue.organisationId;
    const loadTasks$ = this.http.get<Task[]>(`${environment.apiUrl}/tasks?taskById=${currentUserId}`).pipe(
      catchError(err => {
        const message = "Could not load Tasks"
        console.log(message);
        return throwError(err);
      }),

      mergeMap(
        task => {
          return this.getUsers().pipe(
            map(user => {
              let taskUser = task.map(task => {
                let username = user.find(user => task.userId == user.id);
                const username1 = username!.username;
                let obj = {
                  ...task,
                  username: username1
                }
                console.log(obj);
                return obj;
              });
              this.subject.next(taskUser)
            })
          )
        }
      ),
    );
    loadTasks$.subscribe();
  }

  getTasksByStatus(status: Status): Observable<TaskUser[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(tasks => tasks.status == status))
    )
  }

  updateStatus(tasksId: number, changes: Partial<Task>): Observable<any> {
    const tasks = this.subject.getValue();
    let index = tasks.findIndex(task => task.id == tasksId);

    const newTask: TaskUser = {
      ...tasks[index],
      ...changes

    };
    const newTasks: TaskUser[] = tasks.slice(0);
    newTasks[index] = newTask
    this.subject.next(newTasks);
    return this.http.put(`${environment.apiUrl}/update-status`, {
      tasksId, changes,
    }).pipe(
      catchError(err => {
        const message = "Could not save task"
        console.log(message);
        return throwError(err);
      }),
      shareReplay()
    );
  }

  getUsers() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`)
  }

}
