import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriversSyncResolver } from '../drivers/resolvers/drivers.sync.resolver';
import { CostsFilteredResolver } from '../trips/resolvers/costs.filtered.resolver';
import { CostsResolver } from '../trips/resolvers/costs.resolver';
import { TripsFilteredResolver } from '../trips/resolvers/trips.filtered.resolver';
import { MaintenanceTracksComponent } from './maintenance/maintenance.tracks.component';
import { ManageTracksComponent } from './manage/manage.tracks.component';
import { HideTruckDetailsResolver } from './resolvers/hide-driver-details.resolver';
import { MaintenanceForTruckResolver } from './resolvers/maintenance-for-truck.resolver';
import { ShowTruckDetailsResolver } from './resolvers/show-driver-details.resolver';
import { TracksResolver } from './resolvers/tracks.resolver';
import { TripsDetailsTracksComponent } from './tripsDetails/tripsDetails.tracks.component';

const routes: Routes = [
  { 
    path: '',
    component: ManageTracksComponent, 
    resolve: { item: TracksResolver, hd: HideTruckDetailsResolver},
    children: [
        {
          path:"track/details/:filterKey",
          pathMatch: 'full',
          component: TripsDetailsTracksComponent,
          resolve: {ds: TripsFilteredResolver, drivers: DriversSyncResolver, sd: ShowTruckDetailsResolver}
        },
        {
          path:"track/maintenance/:filterKey",
          pathMatch: 'full',
          component: MaintenanceTracksComponent,
          resolve: {ms: MaintenanceForTruckResolver, sd: ShowTruckDetailsResolver}
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TracksRoutingModule { }
