import { Injectable } from '@angular/core';
import { Driver } from '../models/driver';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';
import { HideDetailsResolver } from 'src/app/modules/shared/generic/resolvers/hide-details.resolver';


@Injectable({
  providedIn: 'root'
})
export class HideDriverDetailsResolver extends HideDetailsResolver<Driver> {
  constructor(protected ds: DetailsDialogService<Driver>) {
    super(ds)
  }
}