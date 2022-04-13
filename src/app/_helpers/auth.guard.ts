import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.currentUserValue;

    if (user) {
      if (route.data.roles && route.data.roles.indexOf(user.userType) === -1) {
        this.router.navigate(['/']).then();
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']).then();
    return false;
  }
}
