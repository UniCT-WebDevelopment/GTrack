import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditItemComponent } from '../../shared/components/editItem/edit.item.component';
import { ManagePackagesComponent } from './manage/manage.packages.component';
import { PackageResolver } from './resolvers/package.resolver';
import { PackagesOfCurrentMonthResolver } from './resolvers/packages.currentMonth.resolver';

const routes: Routes = [
  { 
    path: '',
    //pathMatch: 'full',
    component: ManagePackagesComponent, 
    resolve: { item: PackagesOfCurrentMonthResolver },
    children: [
      { 
        path: 'package/edit',
        pathMatch: 'full',
        component: EditItemComponent,
        resolve: { item: PackageResolver } 
      },
      { 
        path: 'package/edit/:id',
        pathMatch: 'full',
        component: EditItemComponent,
        resolve: { item: PackageResolver }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagesRoutingModule { }
