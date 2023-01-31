import { Injectable } from '@angular/core';
import { ItemsFilteredResolver } from 'src/app/modules/shared/generic/resolvers/items.filtered.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { Package } from '../models/package';
import { PackagesService } from '../packages.service';


@Injectable({
  providedIn: 'root'
})
export class PackagesFilteredResolver extends ItemsFilteredResolver<Package> {
  
  constructor(itemService: PackagesService, dialogService: DialogService<Package>) {
    super(itemService,dialogService)
  }

}