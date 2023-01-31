import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { Delivery } from '../models/delivery';
import { DeliveryService } from '../deliveries.service';
import { ItemsFilteredResolver } from 'src/app/modules/shared/generic/resolvers/items.filtered.resolver';


@Injectable({
  providedIn: 'root'
})
export class DeliveriesFilteredResolver extends ItemsFilteredResolver<Delivery> {
  constructor(itemsService: DeliveryService, dialogService: DialogService<Delivery>) {
    super(itemsService,dialogService)
  }
}