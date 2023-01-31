import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemsResolver } from '../../../shared/generic/resolvers/items.resolver';
import { DriversService } from '../drivers.service';
import { Driver } from '../models/driver';



@Injectable({
  providedIn: 'root'
})
export class DriversResolver extends ItemsResolver<Driver> {
  constructor(itemService: DriversService, dialogService: DialogService<Driver>) {
    super(itemService, dialogService)
  }
}