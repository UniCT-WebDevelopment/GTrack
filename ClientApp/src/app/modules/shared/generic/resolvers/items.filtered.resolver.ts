import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { allItemsSetKey } from '../../GlobalConstants';
import { IdentificableItem } from '../models/IdentificableItem';
import { EntityFilterOperator, PropertyFilter } from '../filters/filtering/PropertyFilter';
import { getFilterKeyForEntity } from '../filters/filters.helper';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';
import { GetFilterFromRoute } from '../helpers/routing.helper';


@Injectable()
export abstract class ItemsFilteredResolver<T extends IdentificableItem> implements Resolve<boolean>{ 
  cacheKey: string = allItemsSetKey
  constructor(protected itemsService: CrudService<T>, protected dialogService: DialogService<T>) {}
  

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    let filter = this.getFilter(route);
    if(filter == null)
      this.cacheKey = allItemsSetKey;
    else
      this.cacheKey = getFilterKeyForEntity(this.itemsService.getFakeEntityObject(),filter);
    if(!this.itemsService.items[this.cacheKey]) 
     this.itemsService.items[this.cacheKey] = new BehaviorSubject<T[] | null | undefined>(undefined);
    this.itemsService.items[this.cacheKey].next(undefined); //start loading
    if(filter == null){
      console.warn("Cannot get filter. The FilteredResolver will use the default AllItems key.")
      this.itemsService.getItems(null).then(res => {}); //TODO: dangerous -> delete it.
    }
    else
      this.itemsService.getFilteredItems(null, filter).then(res => {});
    //todo remove
    this.dialogService.showDialog.next(false);
    return of(true);  
  }

  getFilter(route: ActivatedRouteSnapshot):  [PropertyFilter<any>,EntityFilterOperator|null][] | PropertyFilter<any> | null {
    let filter = GetFilterFromRoute<T>(this.itemsService.getFakeEntityObject(),route);
    if(filter instanceof Array){
      filter.filter(f => f[0].subContext).forEach(f => {
        this.itemsService.setQueryContext(f[0].key, f[0].value, f[0].subContext!)
      })
    }
    else if(filter instanceof PropertyFilter  && filter.subContext){
      this.itemsService.setQueryContext(filter.key, filter.value, filter.subContext!)
    }
    return filter
  }

}


