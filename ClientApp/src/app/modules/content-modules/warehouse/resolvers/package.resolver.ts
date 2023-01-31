import { Injectable } from '@angular/core';
import { ItemResolver } from 'src/app/modules/shared/generic/resolvers/item.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { Package } from '../models/package';
import { PackagesService } from '../packages.service';


@Injectable({
  providedIn: 'root'
})
export class PackageResolver extends ItemResolver<Package> {
  constructor(itemService: PackagesService, dialogService: DialogService<Package>) {
    super(itemService,dialogService)
  }
}