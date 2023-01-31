import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersSyncResolver } from '../customers/resolvers/customers.sync.resolver';
import { DriversResolver } from '../drivers/resolvers/drivers.resolver';
import { DriversSyncResolver } from '../drivers/resolvers/drivers.sync.resolver';
import { TracksResolver } from '../tracks/resolvers/tracks.resolver';
import { TracksSyncResolver } from '../tracks/resolvers/tracks.sync.resolver';
import { PackagesFilteredResolver } from '../warehouse/resolvers/packages.filtered.resolver';
import { PackagesResolver } from '../warehouse/resolvers/packages.resolver';
import { EditCostComponent } from './editCost/edit.cost.component';
import { EditStageComponent } from './editStage/edit.stage.component';
import { EditTripsComponent } from './editTrip/edit.trips.component';
import { ManageTripsComponent } from './manage/manage.trips.component';
import { CostsFilteredResolver } from './resolvers/costs.filtered.resolver';
import { CostsResolver } from './resolvers/costs.resolver';
import { StagesFilteredResolver } from './resolvers/stages.filtered.resolver';
import { StagesResolver } from './resolvers/stages.resolver';
import { TripResolver } from './resolvers/trip.resolver';
import { TripsOfCurrentMonthResolver } from './resolvers/trips.currentMonth.resolver';
import { TripsResolver } from './resolvers/trips.resolver';

const routes: Routes = [
  { 
    path: '',
    //pathMatch: 'full',
    component: ManageTripsComponent,
    resolve : { drivers: DriversSyncResolver, tracks: TracksSyncResolver, items: TripsOfCurrentMonthResolver},
    children: [
      { 
        path: 'trip/edit',
        pathMatch: 'full',
        component: EditTripsComponent,
        resolve: { drivers: DriversResolver, tracks: TracksResolver, item: TripResolver } //order is important to show dialog.
      },
      { 
        path: 'trip/edit/:id',
        pathMatch: 'full',
        component: EditTripsComponent,
        resolve: {  drivers: DriversResolver, tracks: TracksResolver, item: TripResolver }
      },
      { 
        path: 'cost/edit/:filterKey',
        pathMatch: 'full',
        component: EditCostComponent,
        resolve: { item: CostsFilteredResolver }
      },
      { 
        path: 'stage/edit/:filterKey',
        pathMatch: 'full',
        component: EditStageComponent,
        resolve: { customers: CustomersSyncResolver ,drivers: DriversSyncResolver, tracks: TracksSyncResolver, packages: PackagesFilteredResolver, item: StagesFilteredResolver }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripsRoutingModule { }
