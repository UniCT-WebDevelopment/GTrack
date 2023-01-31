import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersModule } from '../content-modules/customers/customers.module';
import { SidebarLayoutComponent } from './sidebar-layout.component';

const routes: Routes = [
    {
      path: '',
      component: SidebarLayoutComponent,
      canActivateChild: [],
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: "tracks"
        },
        {
          path: 'tracks',
          loadChildren: () => import('../content-modules/tracks/tracks.module').then(m => m.TracksModule),
          canActivateChild: [],
        },
        {
          path: 'trips',
          loadChildren: () => import('../content-modules/trips/trips.module').then(m => m.TripsModule),
          canActivateChild: [],
        },
        {
          path: 'drivers',
          loadChildren: () => import('../content-modules/drivers/drivers.module').then(m => m.DriversModule),
          canActivateChild: [],
        },
        {
          path: 'users',
          loadChildren: () => import('../content-modules/users/users.module').then(m => m.UsersModule),
          canActivateChild: [],
        },
        {
          path: 'warehouse',
          loadChildren: () => import('../content-modules/warehouse/packages.module').then(m => m.PackagesModule),
          canActivateChild: [],
        },
        {
          path: 'customers',
          loadChildren: () => import('../content-modules/customers/customers.module').then(m => CustomersModule)
        }
      ]
    },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SidebarLayoutRoutingModule { }
