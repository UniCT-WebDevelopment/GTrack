import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { allItemsSetKey } from '../../GlobalConstants';
import { IdentificableItem } from '../models/IdentificableItem';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';

@Injectable()
export class ItemSyncResolver<T extends IdentificableItem> implements Resolve<T|undefined> {
  constructor(protected itemService: CrudService<T>,protected dialogService: DialogService<T>) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<T|undefined> {
    var id = route.paramMap.get("id");
    if(!id){
      this.itemService.item.next(null);
      return undefined;
    }
    else{
      this.itemService.item.next(undefined); //start loading
      let res = await this.itemService.getItem({uid: id} as T)
      this.dialogService.showDialog.next(true);
      return res;
    }  
  }
}