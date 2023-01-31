import { Injectable } from '@angular/core';
import { ItemsFilteredResolver } from 'src/app/modules/shared/generic/resolvers/items.filtered.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemsResolver } from '../../../shared/generic/resolvers/items.resolver';
import { MaintenanceCost } from '../models/maintenanceCost';
import { MaintenancesService } from '../maintenances.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PropertyFilter, EntityFilterOperator } from 'src/app/modules/shared/generic/filters/filtering/PropertyFilter';
import { getFilterValue } from 'src/app/modules/shared/generic/filters/filters.helper';


@Injectable({
  providedIn: 'root'
})
export class MaintenanceForTruckResolver extends ItemsFilteredResolver<MaintenanceCost> {
  constructor(protected itemService: MaintenancesService, dialogService: DialogService<MaintenanceCost>) {
    super(itemService, dialogService)
  }
}