import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemResolver } from '../../../shared/generic/resolvers/item.resolver';
import { Delivery } from '../models/delivery';
import { DeliveryService } from '../deliveries.service';
import { ItemsResolver } from 'src/app/modules/shared/generic/resolvers/items.resolver';


@Injectable({
  providedIn: 'root'
})
export class DeliveriesResolver extends ItemsResolver<Delivery> {
  constructor(itemsService: DeliveryService, dialogService: DialogService<Delivery>) {
    super(itemsService,dialogService)
  }
}