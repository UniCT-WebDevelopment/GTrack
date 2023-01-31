import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';
import { HideDetailsResolver } from 'src/app/modules/shared/generic/resolvers/hide-details.resolver';


@Injectable({
  providedIn: 'root'
})
export class HideUsersDetailsResolver extends HideDetailsResolver<User> {
  constructor(protected ds: DetailsDialogService<User>) {
    super(ds)
  }
}