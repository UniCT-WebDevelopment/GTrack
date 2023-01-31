import { Injectable } from '@angular/core';
import { ShowDetailsResolver } from 'src/app/modules/shared/generic/resolvers/show-details.resolver';
import { Customer } from '../models/customer';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';


@Injectable({
  providedIn: 'root'
})
export class ShowCustomerDetailsResolver extends ShowDetailsResolver<Customer> {
  constructor(protected ds: DetailsDialogService<Customer>) {
    super(ds)
  }
}