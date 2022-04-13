import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from "./dashboard";

import { OrganisationRoutingModule } from './organisation-routing.module';
import { OrganisationComponent } from "./organisation.component";


@NgModule({
  declarations: [OrganisationComponent,DashboardComponent],
  exports :[ OrganisationComponent ],
  imports: [
    CommonModule,
    OrganisationRoutingModule
  ]
})
export class OrganisationModule { }
