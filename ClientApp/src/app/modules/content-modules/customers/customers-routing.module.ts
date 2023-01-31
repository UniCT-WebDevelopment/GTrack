import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsCustomersComponent } from './dialog/details.customers.component';
import { ManageCustomersComponent } from './manage/manage.customers.component';
import { CustomersResolver } from './resolvers/customers.resolver';
import { HideCustomerDetailsResolver } from './resolvers/hide-customer-details.resolver';
import { ShowCustomerDetailsResolver } from './resolvers/show-customer-details.resolver';
import { DeliveriesFilteredResolver } from './resolvers/deliveries.filtered.resolver';
import { TripsOfCurrentMonthResolver } from '../trips/resolvers/trips.currentMonth.resolver';
import { StagesOfCurrentMonthResolver } from '../trips/resolvers/stages.currentMonth.resolver';

const routes: Routes = [
  { 
    path: '',
    //pathMatch: 'full',
    component: ManageCustomersComponent, 
    resolve: { item: CustomersResolver, hd: HideCustomerDetailsResolver },
    children: [
      {
        path: 'customer/details/:filterKey',
        pathMatch: 'full',
        component: DetailsCustomersComponent, //filtered resolver download data based on entity properties, so we will use the currentmonth if we want first to have all deliveries of current month, and then we will use the servire that download deliveries based on trip dates. 
        //same thing should be done in packages, using first packages of current month (and the service download the trips of current week, set the uid of trips in batches and download the packages by trip batches, appending the unrelated packages at the first page maybe.)
        resolve: {ds: DeliveriesFilteredResolver, sd: ShowCustomerDetailsResolver} //qui scarico trips per customer e delivery per customer. 
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
