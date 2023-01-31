import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemsResolver } from '../../../shared/generic/resolvers/items.resolver';
import { Package } from '../models/package';
import { PackagesService } from '../packages.service';


@Injectable({
  providedIn: 'root'
})
export class PackagesResolver extends ItemsResolver<Package> {
  constructor(itemService: PackagesService, dialogService: DialogService<Package>) {
    super(itemService,dialogService)
  }
}