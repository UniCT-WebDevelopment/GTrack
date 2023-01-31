import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditItemComponent } from '../../shared/components/editItem/edit.item.component';
import { TripsResolver } from '../trips/resolvers/trips.resolver';
import { TripsSyncResolver } from '../trips/resolvers/trips.sync.resolver';
import { ChangePasswordComponent } from './changePassword/change.passsword.component';
import { EditUsersComponent } from './edit/edit.users.component';
import { ManageUsersComponent } from './manage/manage.users.component';
import { HideUsersDetailsResolver } from './resolvers/hide-user-details.resolver';
import { ShowUserDetailsResolver } from './resolvers/show-user-details.resolver';
import { UserFromFilterKeyResolver } from './resolvers/user.filterKey.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { UsersResolver } from './resolvers/users.resolver';

const routes: Routes = [
  { 
    path: '',
    //pathMatch: 'full',
    component: ManageUsersComponent, 
    resolve: { item: UsersResolver, hd: HideUsersDetailsResolver},
    children: [
      // { 
      //   path: 'user/edit',
      //   pathMatch: 'full',
      //   component: EditUsersComponent,
      //   resolve: { item: UserResolver }
      // },
      // { 
      //   path: 'user/edit/:id',
      //   pathMatch: 'full',
      //   component: EditUsersComponent,
      //   resolve: { item: UserResolver }
      // },
      { 
        path: 'user/changepassword/:filterKey',
        pathMatch: 'full',
        component: ChangePasswordComponent,
        resolve: { item: UserFromFilterKeyResolver , sd: ShowUserDetailsResolver }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
