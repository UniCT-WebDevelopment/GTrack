import { Injectable } from '@angular/core';
import { ShowDetailsResolver } from 'src/app/modules/shared/generic/resolvers/show-details.resolver';
import { Driver } from '../models/driver';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';


@Injectable({
  providedIn: 'root'
})
export class ShowDriverDetailsResolver extends ShowDetailsResolver<Driver> {
  constructor(protected ds: DetailsDialogService<Driver>) {
    super(ds)
  }
}