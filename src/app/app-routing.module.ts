import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./_helpers/auth.guard";
import { LoginComponent } from "./login";
import { SignupComponent } from "./signup";

const routes: Routes = [

  {
    path: 'auth',
    canActivate: [AuthGuard],
    loadChildren: () => import('./organisation/organisation.module').then(m => m.OrganisationModule)
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'signup',
    component: SignupComponent
  },


  { path: '**', redirectTo: 'not-found' }

]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
