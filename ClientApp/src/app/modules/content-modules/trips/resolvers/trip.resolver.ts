import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemResolver } from '../../../shared/generic/resolvers/item.resolver';
import { Trip } from '../models/models';
import { TripsService } from '../trips.service';

@Injectable({
  providedIn: 'root'
})
export class TripResolver extends ItemResolver<Trip> {
  constructor(itemService: TripsService, dialogService: DialogService<Trip>) {
    super(itemService,dialogService)
  }
}