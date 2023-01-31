import { Injectable } from '@angular/core';
import { ItemsFilteredResolver } from 'src/app/modules/shared/generic/resolvers/items.filtered.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemsResolver } from '../../../shared/generic/resolvers/items.resolver';

import { ActivatedRouteSnapshot } from '@angular/router';
import { PropertyFilter, EntityFilterOperator, PropertyFilterMatchCriteria } from 'src/app/modules/shared/generic/filters/filtering/PropertyFilter';
import * as moment from 'moment';
import { Package } from '../models/package';
import { PackagesService } from '../packages.service';
import { PackagesUtilsService } from '../packages.utils.service';


@Injectable({
  providedIn: 'root'
})
export class PackagesOfCurrentMonthResolver extends ItemsFilteredResolver<Package> {
  constructor(itemService: PackagesService, dialogService: DialogService<Package>, private packagesUtils: PackagesUtilsService) {
    super(itemService, dialogService)
  }
  override getFilter(route: ActivatedRouteSnapshot): PropertyFilter<any> | [PropertyFilter<any>, EntityFilterOperator | null][] | null {
    return this.packagesUtils.getPackagesCurrentMonthFilter();
  }
}