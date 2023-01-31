import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { allItemsSetKey } from '../../GlobalConstants';
import { IdentificableItem } from '../models/IdentificableItem';
import { EntityFilterOperator, PropertyFilter } from '../filters/filtering/PropertyFilter';
import { getFilterKeyForEntity, getPaginationKeyForEntity } from '../filters/filters.helper';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';
import { GetFilterFromRoute, GetPaginationOptionsFromRoute } from '../helpers/routing.helper';
import { ItemsPaginator } from '../filters/pagination/ItemsPaginator';
import { PropertySorter } from '../filters/sorting/PropertySorting';


@Injectable()
export abstract class ItemsPaginatedResolver<T extends IdentificableItem> implements Resolve<boolean>{ 
  cacheKey: string = allItemsSetKey
  constructor(protected itemsService: CrudService<T>, protected dialogService: DialogService<T>) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    let paginationOptions = this.getPaginationOptions(route);
    if(paginationOptions == null)
      this.cacheKey = allItemsSetKey;
    else
      this.cacheKey = getPaginationKeyForEntity(this.itemsService.getFakeEntityObject(),paginationOptions);
    if(!this.itemsService.items[this.cacheKey]) 
     this.itemsService.items[this.cacheKey] = new BehaviorSubject<T[] | null | undefined>(undefined);
    this.itemsService.items[this.cacheKey].next(undefined); //start loading
    if(paginationOptions == null){
      console.warn("Cannot get paginationOptions. The PaginatedResolver will use the default AllItems key.")
      this.itemsService.getItems(null).then(res => {});
    }
    else
      this.itemsService.getPaginatedItems(null, paginationOptions).then(res => {});
    //IMPROVE: remove -> separate dialog operations
    this.dialogService.showDialog.next(false);
    return of(true);  
  }

  getPaginationOptions(route: ActivatedRouteSnapshot):  [ItemsPaginator,PropertySorter[] | null] | null {
    return GetPaginationOptionsFromRoute<T>(this.itemsService.getFakeEntityObject(),route);
  }

}


