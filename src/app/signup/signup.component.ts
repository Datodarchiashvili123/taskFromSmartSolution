import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Organisation } from "../models/organisation";
import { Role } from "../models/role";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  errorMessage: string | undefined;
  registration!: FormGroup;
  submitted = false;
  error = '';
  successMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.registration = this.formBuilder.group({
      organization: '',
      mobile: '',
      address: '',
      username: '',
      name: '',
      surname: '',
      password: '',
      email: ['', Validators.required],
    });

  }

  get f() {
    return this.registration.controls;
  }

  onSubmit() {
    this.submitted = true;

    const organisation: Organisation = {

      organisationName: this.registration.value.organization,
      phoneNumber: this.registration.value.mobile,
      address: this.registration.value.address,
      username: this.registration.value.username,
      name: this.registration.value.name,
      surname: this.registration.value.surname,
      email: this.registration.value.email,
      password: this.registration.value.password,
      userType: Role.Admin,
    }

    this.http.put(`${environment.apiUrl}/create-organisation`,
      organisation).subscribe(
      () => {
        this.authenticationService.login(organisation.email, organisation.password).subscribe();
      },
      () => {
        console.log(this.error, 'error')
      }
    );

  }

}
