import { Injectable } from '@angular/core';
import { ItemsSyncResolver } from 'src/app/modules/shared/generic/resolvers/items.sync.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { Trip } from '../models/models';
import { TripsService } from '../trips.service';

@Injectable({
  providedIn: 'root'
})
export class TripsSyncResolver extends ItemsSyncResolver<Trip> {
  constructor(itemService: TripsService, dialogService: DialogService<Trip>) {
    super(itemService, dialogService)
  }
}