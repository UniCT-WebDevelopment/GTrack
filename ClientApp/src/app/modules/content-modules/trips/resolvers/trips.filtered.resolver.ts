import { Injectable } from '@angular/core';
import { ItemsFilteredResolver } from 'src/app/modules/shared/generic/resolvers/items.filtered.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemsResolver } from '../../../shared/generic/resolvers/items.resolver';
import { Trip } from '../models/models';
import { TripsService } from '../trips.service';

@Injectable({
  providedIn: 'root'
})
export class TripsFilteredResolver extends ItemsFilteredResolver<Trip> {
  constructor(itemService: TripsService, dialogService: DialogService<Trip>) {
    super(itemService, dialogService)
  }
}