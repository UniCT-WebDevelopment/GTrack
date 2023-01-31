import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemsResolver } from '../../../shared/generic/resolvers/items.resolver';
import { Customer } from '../models/customer';
import { CustomersService } from '../customers.service';
import { ItemsSyncResolver } from 'src/app/modules/shared/generic/resolvers/items.sync.resolver';


@Injectable({
  providedIn: 'root'
})
export class CustomersSyncResolver extends ItemsSyncResolver<Customer> {
  constructor(itemService: CustomersService, dialogService: DialogService<Customer>) {
    super(itemService,dialogService)
  }
}