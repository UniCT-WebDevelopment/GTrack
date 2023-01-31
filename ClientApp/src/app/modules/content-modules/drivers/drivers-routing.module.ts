import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripsFilteredResolver } from '../trips/resolvers/trips.filtered.resolver';
import { DetailsDriversComponent } from './dialog/details.drivers.component';
import { ManageDriversComponent } from './manage/manage.drivers.component';
import { DriversResolver } from './resolvers/drivers.resolver';
import { HideDriverDetailsResolver } from './resolvers/hide-driver-details.resolver';
import { ShowDriverDetailsResolver } from './resolvers/show-driver-details.resolver';

const routes: Routes = [
  { 
    path: '',
    component: ManageDriversComponent,
    resolve: {item: DriversResolver, hd: HideDriverDetailsResolver},
    children: [
      {
        path:"driver/details/:filterKey",
        pathMatch: 'full',
        component: DetailsDriversComponent,
        resolve: {ds: TripsFilteredResolver, sd: ShowDriverDetailsResolver}

      }
    ]
  
  }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriversRoutingModule { }
