import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { allItemsSetKey } from '../../GlobalConstants';
import { IdentificableItem } from '../models/IdentificableItem';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';

@Injectable()
export class ItemsSyncResolver<T extends IdentificableItem> implements Resolve<T[] | undefined> {
  cacheKey: string = allItemsSetKey
  constructor(protected itemsService: CrudService<T>, protected dialogService: DialogService<T>) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<T[] | undefined> {
      this.itemsService.items[this.cacheKey].next(undefined); //start loading
      return (await this.itemsService.getItems());
    }
}
