import { Injectable } from '@angular/core';
import { ItemsSyncResolver } from 'src/app/modules/shared/generic/resolvers/items.sync.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { DriversService } from '../drivers.service';
import { Driver } from '../models/driver';



@Injectable({
  providedIn: 'root'
})
export class DriversSyncResolver extends ItemsSyncResolver<Driver> {
  constructor(itemService: DriversService, dialogService: DialogService<Driver>) {
    super(itemService, dialogService)
  }
}