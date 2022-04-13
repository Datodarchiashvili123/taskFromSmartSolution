import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { delay, dematerialize, materialize, mergeMap } from "rxjs/operators";
import { Organisation } from "../models/organisation";
import { Role } from "../models/role";
import { Status } from "../models/status";
import { Task } from "../models/task";
import { User } from "../models/user";

const organisations: Organisation[] = [
  {
    id: 1,
    organisationName:'new company',
    phoneNumber:'995555777',
    address:'Tbilisi',
    username: 'username',
    name: 'david',
    surname: 'darchiashvili',
    email: 'organization@mail.com',
    password: 'password1!',
    userType: Role.Admin,
  },

  {
    id: 2,
    organisationName:'step by step',
    phoneNumber:'995555777',
    address:'Tbilisi',
    username: 'username',
    name: 'jack',
    surname: 'darchiashvili',
    email: 'david@mail.com',
    password: 'password1!',
    userType: Role.Admin,
  },

]


const users: User[] = [
  {
    id: 1,
    organisationId: 1,
    email: 'admin@gmail.com',
    password: 'admin',
    userType: Role.Admin,
    token: 'fake-jwt-token',
    username: 'david',
    name:'unnamed',
    surname: 'surname'
  },

  {
    id: 2,
    organisationId: 1,
    taskId: 1,
    email: 'admin1@gmail.com',
    password: 'admin',
    userType: Role.Admin,
    token: 'fake-jwt-token',
    username: 'jack',
    name:'unnamed',
    surname: 'surname'
  },

  {
    id: 3,
    organisationId: 2,
    taskId: 1,
    email: 'test@gmail.com',
    password: 'test',
    userType: Role.User,
    token: ' fake-jwt-token',
    username: 'user',
    name: 'david',
    surname:'surname',
  }
];


const tasks: Task[] = [
  {
    id: 1,
    organisationId: 1,
    userId:1,
    title:'task 1',
    description:' first task description',
    deadline: ' deadline time',
    status: Status.ToDo,
  },


  {
    id: 2,
    organisationId: 1,
    userId:1,
    title:'task 2',
    description:' first task description',
    deadline: ' deadline time',
    status: Status.InProgress,
  },

  {
    id: 3,
    organisationId: 1,
    userId:2,
    title:'task 3',
    description:' first task description',
    deadline: ' deadline time',
    status: Status.Done,
  },

  {
    id: 4,
    organisationId: 1,
    userId:2,
    title:'task 4',
    description:' forth task description',
    deadline: ' deadline time',
    status: Status.ToDo,
  },

  {
    id: 5,
    organisationId: 2,
    userId:1,
    title:'task 1',
    description:' first task description',
    deadline: ' deadline time',
    status: Status.InProgress,
  },
  {
    id: 6,
    organisationId: 2,
    userId:1,
    title:'task 1',
    description:' first task description',
    deadline: ' deadline time',
    status: Status.Done,
  },
  {
    id: 7,
    organisationId: 2,
    userId:1,
    title:'task 1',
    description:' first task description',
    deadline: ' deadline time',
    status: Status.ToDo,
  },
  {
    id: 8,
    organisationId: 2,
    userId:1,
    title:'task 1',
    description:' first task description',
    deadline: ' deadline time',
    status: Status.ToDo,
  },
]


@Injectable()
export class FakeBackend implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    let lastUserId = 8;
    let lastOrganizationId = 2;
    const { url, method, headers, body } = request;

    return of(null)
    .pipe(mergeMap(handleRoute))
    .pipe(materialize())
    .pipe(delay(200))
    .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/auth/login') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.endsWith('/create') && method === 'PUT':
          return createUsers();
        case url.endsWith('/create-organisation') && method === 'PUT':
          return createOrganisation();
        case url.endsWith('/organisations') && method === 'GET':
          return getOrganisation();
        case url.includes('organisationId') && method === 'GET':
          return getEmployees();
        case url.includes('update-status') && method === 'PUT':
          return updateStatus();

        case url.includes('organisation') && method === 'GET':
          return getOrganisationById();
        case url.includes('tasks') && method === 'GET':
          return getTasks();
        default:
          return next.handle(request);
      }
    }

    function createOrganisation(){
      let organisation = body;
      const  canAdd = organisations.map(x => x.email === organisation.email ).includes(true);
      if(canAdd) return error('Username is already taken');

      lastOrganizationId++;
      lastUserId++;
      const { email, password,  username, name, surname} = body;
      let user: User ={
        id: lastUserId,
        organisationId: lastOrganizationId,
        email: email,
        password: password,
        userType: Role.Admin,
        username: username,
        name: name,
        surname: surname,
        token: `Bearer `
      }

      users.push(user);
      console.log(users, ' users from back');

      organisation = {
        id: lastOrganizationId,
          ...organisation
      }
      organisations.push(organisation);
      console.log(organisations, ' users from back')
      return ok();
    }

    function createUsers(){
      const user = body;
      const  canAdd = users.map(x => x.email === user.email ).includes(true);
      if(canAdd) return error('Username is already taken');
      users.push(user);
      return ok();
    }


    function authenticate() {
      const { email, password } = body;
      const user = users.find(x => x.email === email && x.password === password);
      if (!user) return error('Username or password is incorrect');
      return ok({
        id: user.id,
        name: user.name,
        userType: user.userType,
        token: `Bearer ${user.token}`,
        email: user.email,
        organisationId: user.organisationId,
        username: user.username,
        surname: user.surname,
      });
    }

    function getTasks(){
      let urlId =  url.split("=")[1];
      let task = tasks.filter((task )=> task.organisationId == parseInt(urlId));
      console.log(task, ' task');
      return ok(task);
    }

    function getUsers() {
      // if (!isLoggedIn()) return unauthorized();
      return ok(users);
    }

    function error(message: string) {
      return throwError({ error: { message } });
    }

    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } })
      .pipe(materialize(), delay(500), dematerialize());;
    }

    function isLoggedIn() {
      const authHeader = headers.get('Authorization') || '';
      return authHeader.startsWith('Bearer ');
    }

    function getOrganisation(){
      return ok(organisations)
    }

    function  getOrganisationById() {
      let urlId =  url.split("=")[1];
      let organisationById = organisations.filter((organisation )=> organisation.id == parseInt(urlId))[0];
      return ok(organisationById);
    }

    function  getEmployees() {
      let urlId =  url.split("=")[1];
      let employees = users.filter((user )=> user.id == parseInt(urlId ));
      return ok(employees);
    }

    function updateStatus() {
     const { changes } = body;
      let updateTask = tasks.find(task => task.id == changes.id);
      if(updateTask){
        updateTask.status = body.status
      }
      return ok(updateTask)
    }

  }

}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackend,
  multi: true
};

