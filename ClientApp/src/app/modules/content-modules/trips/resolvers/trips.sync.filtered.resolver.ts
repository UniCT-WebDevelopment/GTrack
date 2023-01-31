import { Injectable } from '@angular/core';
import { ItemsSyncFilteredResolver } from 'src/app/modules/shared/generic/resolvers/items.sync.filtered.resolver';
import { ItemsSyncResolver } from 'src/app/modules/shared/generic/resolvers/items.sync.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { Trip } from '../models/models';
import { TripsService } from '../trips.service';

@Injectable({
  providedIn: 'root'
})
export class TripsSyncFilteredResolver extends ItemsSyncFilteredResolver<Trip> {
  constructor(itemService: TripsService, dialogService: DialogService<Trip>) {
    super(itemService, dialogService)
  }
}