import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Status } from "../models/status";
import { Task, TaskUser } from "../models/task";
import { OrganisationService } from "./organisation.service";
import { TasksStoryService } from "./tasks-story.service";

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss'],
})
export class OrganisationComponent implements OnInit {
  organisation$: Observable<any>;
  tasks$: Observable<any>;
  toDoTasks$: Observable<TaskUser[] | undefined> | undefined;
  inProgressTasks$: Observable<TaskUser[] | undefined> | undefined;
  doneTasks$: Observable<TaskUser[] | undefined> | undefined;

  constructor(
    public organisationService: OrganisationService,
    private http: HttpClient,
    private tasksStore: TasksStoryService,
  ) {
    this.organisation$ = this.organisationService.getOrganisation();
    this.tasks$ = this.organisationService.getTasks();
    this.organisationService.getTasks();
    this.tasksStore.getTasks();
  }

  ngOnInit(): void {
    this.reloadTasks();
  }

  fromTodoToInProgress(tasksId: number, changes: Task) {
    changes.status = Status.InProgress;
    this.tasksStore.updateStatus(tasksId, changes).subscribe();
  }

  fromInProgressToDone(tasksId: number, changes: Task) {
    changes.status = Status.Done;
    this.tasksStore.updateStatus(tasksId, changes).subscribe();
  }

  fromInProgressToToDo(tasksId: number, changes: Task) {
    changes.status = Status.ToDo;
    this.tasksStore.updateStatus(tasksId, changes).subscribe();
  }

  fromDoneToInProgress(tasksId: number, changes: Task) {
    changes.status = Status.InProgress;
    this.tasksStore.updateStatus(tasksId, changes).subscribe();
  }

  reloadTasks() {
    this.toDoTasks$ = this.tasksStore.getTasksByStatus(Status.ToDo);
    this.inProgressTasks$ = this.tasksStore.getTasksByStatus(Status.InProgress);
    this.doneTasks$ = this.tasksStore.getTasksByStatus(Status.Done);
  }

}
