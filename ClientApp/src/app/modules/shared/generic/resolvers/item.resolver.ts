import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { allItemsSetKey } from '../../GlobalConstants';
import { IdentificableItem } from '../models/IdentificableItem';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';

@Injectable()
export class ItemResolver<T extends IdentificableItem> implements Resolve<boolean> {
  constructor(protected itemService: CrudService<T>,protected dialogService: DialogService<T>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    var id = route.paramMap.get("id");
    if(!id)
      this.itemService.item.next(null);
    else{
      this.itemService.item.next(undefined); //start loading
      this.itemService.getItem({uid: id} as T).then(res => {});
    }  
    this.dialogService.showDialog.next(true);
    return of(true);  
  }
}