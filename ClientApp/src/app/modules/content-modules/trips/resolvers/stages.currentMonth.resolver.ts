import { Injectable } from '@angular/core';
import { ItemsFilteredResolver } from 'src/app/modules/shared/generic/resolvers/items.filtered.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemsResolver } from '../../../shared/generic/resolvers/items.resolver';
import { Trip, TripStage } from '../models/models';
import { TripsService } from '../trips.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PropertyFilter, EntityFilterOperator, PropertyFilterMatchCriteria } from 'src/app/modules/shared/generic/filters/filtering/PropertyFilter';
import * as moment from 'moment';
import { TripsUtilsService } from '../trips.utils.service';
import { StagesService } from '../stages.service';

@Injectable({
  providedIn: 'root'
})
export class StagesOfCurrentMonthResolver extends ItemsFilteredResolver<TripStage> {
  constructor(itemService: StagesService, dialogService: DialogService<TripStage>, private tripUtils: TripsUtilsService) {
    super(itemService, dialogService)
  }
  override getFilter(route: ActivatedRouteSnapshot): PropertyFilter<any> | [PropertyFilter<any>, EntityFilterOperator | null][] | null {
    return this.tripUtils.getTripsCurrentMonthFilter();
  }
}