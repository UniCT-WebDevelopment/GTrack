import { BehaviorSubject } from 'rxjs';
import { EntityFilterOperator, PropertyFilter } from '../filters/filtering/PropertyFilter';
import { IdentificableItem } from '../models/IdentificableItem';
import { getFilterFromKey, getFiltersByKeys, isMatchingFilter } from '../filters/filters.helper';
import { allItemsSetKey } from '../../GlobalConstants';
import { CacheCrudService } from './cache.crud.service';


export abstract class BulkCrudService<T extends IdentificableItem> extends CacheCrudService<T> {

    //bulk operations
    protected abstract createItemsInternal(items: T[]) : Promise<T[] | undefined>
    protected abstract updateItemsInternal(items: T[]) : Promise<boolean>;
    protected abstract deleteItemsInternal(items: T[]) : Promise<boolean>;
    protected abstract getEmptyEntityObject() : T;

    public async createItems(items: T[]): Promise<T[] | undefined> {
        let its = items.map(item => ({...this.getEmptyEntityObject(),...item}));
        return this._createItems(its, this.subsetKey);
    }

    public async editItems(items: T[]): Promise<boolean> {
        return this._editItems(items);
    }

    public async deleteItems(items: T[]): Promise<boolean> {
        return this._deleteItems(items);
    }

    protected async _createItems(items: T[],subsetKey: string): Promise<T[] | undefined> {
            items = items.map(item=> this.deleteUnplannedProperties(item));
            if(subsetKey != allItemsSetKey){ 
                let filter = getFilterFromKey(subsetKey)
                if(filter){
                    items = items.map(i => this.makeSatisfyFilter(i, filter!));
                }
                else{
                    console.warn("Cannot get filter from subsetKey for items: ", JSON.stringify(items));
                }
                   
            }
            var internalResult = await this.createItemsInternal(items);
            if(internalResult != undefined){
                this.reloadCachesSafe(internalResult, "C");    
            }
            return internalResult;
             
    }

    protected async _editItems(items: T[]): Promise<boolean> {
        //get the filterkeys that we have and check if the item that we have 
            items = items.map(item=> this.deleteUnplannedProperties(item));
            var internalResult = await this.updateItemsInternal(items);
            if(internalResult){
                this.reloadCachesSafe(items, "U");
            }

            return internalResult;
    
    }

    protected async _deleteItems(items: T[]): Promise<boolean> {
            items = items.map(item=> this.deleteUnplannedProperties(item));
            var internalResult = await this.deleteItemsInternal(items);
            if(internalResult){
                this.reloadCachesSafe(items, "D");
            }
            return internalResult;
        
    }   

       //returns the item without only the unplannedProperties
       protected deleteUnplannedProperties(item: T): T{
        let newItem = {...item};
        for(var key in newItem){
            if(key.startsWith("_"))
                delete newItem[key]; 
        }
        return newItem;
    }
}
