import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';
import { HideDetailsResolver } from 'src/app/modules/shared/generic/resolvers/hide-details.resolver';


@Injectable({
  providedIn: 'root'
})
export class HideCustomerDetailsResolver extends HideDetailsResolver<Customer> {
  constructor(protected ds: DetailsDialogService<Customer>) {
    super(ds)
  }
}