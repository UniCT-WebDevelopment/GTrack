import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { Customer } from '../models/customer';
import { CustomersService } from '../customers.service';
import { ItemResolver } from 'src/app/modules/shared/generic/resolvers/item.resolver';


@Injectable({
  providedIn: 'root'
})
export class CustomerResolver extends ItemResolver<Customer> {
  constructor(itemService: CustomersService, dialogService: DialogService<Customer>) {
    super(itemService,dialogService)
  }
}