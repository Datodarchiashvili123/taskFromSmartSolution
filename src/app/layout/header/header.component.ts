import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user?: User;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.user = x)
  }

  ngOnInit(): void {
  }

  logOut() {
    this.authenticationService.logout();
  }

}
