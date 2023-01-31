import { BehaviorSubject } from 'rxjs';
import { allItemsSetKey as allItemsSetKey } from '../../GlobalConstants';
import { IdentificableItem } from '../models/IdentificableItem';
import { EntityFilterOperator, PropertyFilter } from '../filters/filtering/PropertyFilter';
import { BulkCrudService } from './bulk.crud.service';
import { getFilterFromKey, getFilterKey, getPaginationKey, isMatchingFilter } from '../filters/filters.helper';
import { ItemsPaginator } from '../filters/pagination/ItemsPaginator';
import { PropertySorter } from '../filters/sorting/PropertySorting';


export abstract class CrudService<T extends IdentificableItem>  extends BulkCrudService<T> {

    constructor() { 
        super();
        this.items[this.subsetKey] = new BehaviorSubject<T[] | undefined | null>(undefined); //undefined is the first state, null means that the element not exists, T is the element returned.
    }

    get itemsObservable(): BehaviorSubject<T[] | undefined | null>{
        return this.items[this.subsetKey];
    } 

    public abstract setQueryContext(parentEntityName: string, parentId: string, context: string) : void;

    public setSubsetKey(key: string){
        this.subsetKey = key;
    }

    //CRUD operations to implement
    protected abstract createItemInternal(item: T) : Promise<T | undefined>;
    protected abstract readItemsInternal(item: T|null) : Promise<T[] | undefined>;
    protected abstract readFilteredItemsInternal(item: T|null, filters: [PropertyFilter<any>,EntityFilterOperator | null][] | PropertyFilter<any>) : Promise<T[] | undefined>;
    protected abstract readPaginatedItemsInternal(item: T|null, paginationOptions: [ItemsPaginator, PropertySorter[] | null]) : Promise<T[] | undefined>;
    protected abstract readItemInternal(item: T) : Promise<T | undefined>;
    protected abstract readItemInternal(item: T) : Promise<T | undefined>;
    
    protected abstract updateItemInternal(item: T) : Promise<boolean>;
    protected abstract deleteItemInternal(item: T) : Promise<boolean>;

    public async getFilteredItems(item: T|null = null, filters: [PropertyFilter<any>,EntityFilterOperator | null][]| PropertyFilter<any>, reloadCache: boolean = false) : Promise<T[] | undefined> {
        return this._getFilteredItems(item, filters, reloadCache);
    }

    public async getPaginatedItems(item: T|null = null, paginationOptions: [ItemsPaginator, PropertySorter[] | null]) : Promise<T[] | undefined> {
        return this._getPaginatedItems(item, paginationOptions);
    }
    
    public async getItems(item: T|null = null, reloadCache: boolean = false): Promise<T[] | undefined> {
        return this._getItems(item,reloadCache);
    }

    public async getItem(item: T, reloadCache: boolean = false): Promise<T | undefined> {
        return this._getItem(item, this.subsetKey,reloadCache);
    }

    public async createItem(item: T, omitCache: boolean = false): Promise<T | undefined> {
        //using the fake entityObjject will add some default properties not defined from the ui.
        //TO-DO: check for nested obj
        return this._createItem({...this.getEmptyEntityObject(),...item}, this.subsetKey, omitCache);
    }

    public async editItem(item: T, omitCache: boolean = false): Promise<boolean> {
        //should we use fake entity? maybe not for dates if they exists for example
        return this._editItem(item, omitCache);
    }

    public async deleteItem(item: T): Promise<boolean> {
        return this._deleteItem(item);
    }

    public getFakeEntityObject() : T {
        return this.getEmptyEntityObject();
    }

    protected async _getFilteredItems(item: T|null = null, filters: [PropertyFilter<any>,EntityFilterOperator | null][] | PropertyFilter<any>, reloadCache: boolean = false): Promise<T[]> {
        var filterKey = getFilterKey(filters);
        if (!this._items[filterKey] || reloadCache){
            //create the observable in a loading state if not exists
            if(!this.items[filterKey]) this.items[filterKey] = new BehaviorSubject<T[] | undefined | null>(undefined);
            var readResult = await this.readFilteredItemsInternal(item, filters);
            if(readResult != undefined){
                this._items[filterKey] = readResult
            }
        }
        this.items[filterKey].next(this._items[filterKey] ?? [])
        return this._items[filterKey];
    }


    protected async _getPaginatedItems(item: T|null = null, paginationOptions: [ItemsPaginator, PropertySorter[] | null]): Promise<T[] | undefined> {
        var paginationKey = getPaginationKey(paginationOptions);
        if (!this._items[paginationKey]){
            //create the observable in a loading state if not exists
            if(!this.items[paginationKey]) this.items[paginationKey] = new BehaviorSubject<T[] | undefined | null>(undefined);
            var readResult = await this.readPaginatedItemsInternal(item, paginationOptions);
            if(readResult != undefined){
                this._items[paginationKey] = readResult
            }
        }
        this.items[paginationKey].next(this._items[paginationKey] ?? [])
        return this._items[paginationKey];
    }


    protected async _getItems(item: T|null = null, reloadCache: boolean = false): Promise<T[] | undefined> {
        if (!this._items[allItemsSetKey] || reloadCache){
            //create the observable in a loading state if not exists
            if(!this.items[allItemsSetKey]) this.items[allItemsSetKey] = new BehaviorSubject<T[] | undefined | null>(undefined);
            var readResult = await this.readItemsInternal(item);
            if(readResult != undefined){
                this._items[allItemsSetKey] = readResult
            }
        }
        this.items[allItemsSetKey].next(this._items[allItemsSetKey] ?? [])
        return this._items[allItemsSetKey];
    }

    protected async _getItem(item: T, subsetKey: string,reloadCache: boolean = false): Promise<T | undefined> {
            var currentItem = this._items[subsetKey] ?  Object.values(this._items[subsetKey]).find(i => i.uid == item.uid) : undefined; // search in each 
            if(!currentItem || reloadCache){
                //create the observable in a loading state if not exists
                if(!this.item) this.item = new BehaviorSubject<T | undefined | null>(undefined);
                var internalResult = await this.readItemInternal(item);
                if(internalResult){
                    this.item.next(internalResult)
                }
                else{
                    console.warn("Cannot find item with uid:" + item.uid)
                    this.item.next(null); //element do not exists.
                }
                return internalResult;
            }
            else{
                this.item.next(currentItem);
                return currentItem; 
            }
    }

    
    protected async _createItem(item: T,subsetKey: string, omitCache: boolean = false): Promise<T | undefined> {
            item = this.deleteUnplannedProperties(item);
            
            if(subsetKey != allItemsSetKey){ 
                let filter = getFilterFromKey(subsetKey)
                if(filter){
                    item = this.makeSatisfyFilter(item, filter);
                }
            }
            var internalResult = await this.createItemInternal(item);
            if(internalResult != undefined && !omitCache){
                this.reloadCachesSafe(internalResult, "C");    
            }
            return {...item, ...internalResult};   
    }

    protected async _editItem(item: T, omitCache: boolean = false): Promise<boolean> {      
            item = this.deleteUnplannedProperties(item);
            var internalResult = await this.updateItemInternal(item); 
            if(internalResult && !omitCache){
                this.reloadCachesSafe(item, "U");
            }
            else{
                console.warn("EditItem returned false");
            }
            return internalResult;  
    }

    protected async _deleteItem(item: T): Promise<boolean> {
            item = this.deleteUnplannedProperties(item);
            var internalResult = await this.deleteItemInternal(item);
            if(internalResult){
                this.reloadCachesSafe(item, "D");
            }
            else{
                console.warn("DeleteItem returned false");
            }
            return internalResult;
    }   


}


