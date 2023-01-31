import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { allItemsSetKey } from '../../GlobalConstants';
import { IdentificableItem } from '../models/IdentificableItem';
import { getFilterKeyForEntity } from '../filters/filters.helper';
import { GetFilterFromRoute } from '../helpers/routing.helper';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';


@Injectable()
export abstract class ItemsSyncFilteredResolver<T extends IdentificableItem> implements Resolve<T[] | undefined> {
    cacheKey: string = allItemsSetKey
    constructor(protected itemsService: CrudService<T>, protected dialogService: DialogService<T>) {}
    
    async resolve(route: ActivatedRouteSnapshot): Promise<T[] | undefined> {
      let filter = GetFilterFromRoute(this.itemsService.getFakeEntityObject(),route);
      if(filter == null)
      this.cacheKey = allItemsSetKey;
    else
      this.cacheKey = getFilterKeyForEntity(this.itemsService.getFakeEntityObject(),filter);
      
      if(!this.itemsService.items[this.cacheKey]) 
        this.itemsService.items[this.cacheKey] = new BehaviorSubject<T[] | null | undefined>(undefined);
      this.itemsService.items[this.cacheKey].next(undefined); //start loading
      if(filter == null){
        console.warn("Cannot extract filter from route. The FilteredResolver will use the default AllItems key.");
        return (await this.itemsService.getItems(null))
      }
      else return (await this.itemsService.getFilteredItems(null, filter));
    }
  
  }
