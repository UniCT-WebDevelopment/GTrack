import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemResolver } from '../../../shared/generic/resolvers/item.resolver';
import { DriversService } from '../drivers.service';
import { Driver } from '../models/driver';


@Injectable({
  providedIn: 'root'
})
export class DriverResolver extends ItemResolver<Driver> {
  constructor(itemService: DriversService, dialogService: DialogService<Driver>) {
    super(itemService,dialogService)
  }
}