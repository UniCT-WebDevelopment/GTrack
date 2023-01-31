import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { allItemsSetKey } from '../../GlobalConstants';
import { IdentificableItem } from '../models/IdentificableItem';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';

@Injectable()
export class ItemsResolver<T extends IdentificableItem> implements Resolve<boolean> {
  cacheKey: string = allItemsSetKey
  constructor(protected itemsService: CrudService<T>, protected dialogService: DialogService<T>) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.itemsService.items[this.cacheKey].next(undefined); //start loading
    this.itemsService.getItems().then(res => {});
    //todo remove
    this.dialogService.showDialog.next(false);
    return of(true);  
  }
}
