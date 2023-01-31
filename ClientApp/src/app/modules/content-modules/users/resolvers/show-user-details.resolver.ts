import { Injectable } from '@angular/core';
import { ShowDetailsResolver } from 'src/app/modules/shared/generic/resolvers/show-details.resolver';
import { User } from '../models/user';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';


@Injectable({
  providedIn: 'root'
})
export class ShowUserDetailsResolver extends ShowDetailsResolver<User> {
  constructor(protected ds: DetailsDialogService<User>) {
    super(ds)
  }
}