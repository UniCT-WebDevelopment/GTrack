import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemsResolver } from '../../../shared/generic/resolvers/items.resolver';
import { Customer } from '../models/customer';
import { CustomersService } from '../customers.service';


@Injectable({
  providedIn: 'root'
})
export class CustomersResolver extends ItemsResolver<Customer> {
  constructor(itemService: CustomersService, dialogService: DialogService<Customer>) {
    super(itemService,dialogService)
  }
}