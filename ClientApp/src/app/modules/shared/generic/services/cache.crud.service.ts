import { BehaviorSubject } from 'rxjs';
import { EntityFilterOperator, PropertyFilter, PropertyFilterMatchCriteria } from '../filters/filtering/PropertyFilter';
import { IdentificableItem } from '../models/IdentificableItem';
import { getFilterFromKey, getFiltersByKeys, getPaginationOptionsByKeys, isMatchingFilter } from '../filters/filters.helper';
import { allItemsSetKey } from '../../GlobalConstants';
import { ItemsPaginator } from '../filters/pagination/ItemsPaginator';
import { PropertySorter } from '../filters/sorting/PropertySorting';


export abstract class CacheCrudService<T extends IdentificableItem>  {
    protected _items: {[key:string]: T[]} = {}
    public items : {[key:string] : BehaviorSubject<T[] | undefined | null>} = {};
    public item : BehaviorSubject<T | undefined | null>
    protected subsetKey = allItemsSetKey;

    constructor(){
        this.items[this.subsetKey] = new BehaviorSubject<T[] | undefined | null>(undefined); //undefined is the first state, null means that the element not exists, T is the element returned.
        this.item = new BehaviorSubject<T | undefined | null>(undefined);//need to be a behaviour subject cause the ngOnInit could be called after tthe service pushes data.
    }

    protected makeSatisfyFilter(item: T, filter: PropertyFilter<any> | [PropertyFilter<any>, EntityFilterOperator | null][]) : T{
        if(filter instanceof Array){
            for(var i = 0; i< filter.length;i++){
                let f = filter[i][0];
                if(f.matchCriteria != PropertyFilterMatchCriteria.EQUALS)//cannot make satisfy filter different from Equals.
                    break;
                if(i==0){
                    (item as any)[f.key] = f.value;
                }
                else{
                    let op = filter[i-1][1];
                    if(op == EntityFilterOperator.AND){
                        (item as any)[f.key] = f.value;
                    }
                    else{
                        console.warn("The filter [key:"+f.key+",value:"+f.value+"] will not be satisfied for the item with uid:" + item.uid +". Only single filter or chain of 'AND' filters can be satisfied by created items")
                    }
                }
            }
        }
        else{
            if(filter.matchCriteria == PropertyFilterMatchCriteria.EQUALS)//cannot make satisfy filter different from Equals.
                (item as any)[filter.key] = filter.value;
        }
        //remove nulls ( why they are inserted??)
        Object.keys(item).forEach((k) => (item as any)[k] == null && delete (item as any)[k]);
        return item;
    }

    private getDifference<T>(a: T[], b: T[]): T[] {
        return a.filter((element) => {
          return !b.includes(element);
        });
      }
    
    protected reloadCachesSafe(items: T | T[], operation: "C"|"U"|"D") {
        let keys = Object.keys(this._items);
        let filtersByKey = getFiltersByKeys(keys);
        let paginationByKeys = getPaginationOptionsByKeys(keys);
        //let otherKeys = this.getDifference<string>(this.getDifference<string>(keys,filtersByKey.map(f=>f[0])),paginationByKeys.map(pk => pk[0]));
        //FILTERS
        filtersByKey.push([allItemsSetKey,[]]); //do also for allItemsKey
        for(var filterAndKey of filtersByKey){
            let key = filterAndKey[0];
            if(filterAndKey[1] != null){ //do only for valid filters
                if(items instanceof Array){ //do for each item
                    let pendingChanges = false;
                    for(var item of items){
                        pendingChanges = this.handleFilterCacheChanges(item,key, filterAndKey[1], operation);
                    }
                    if(pendingChanges)
                        this.items[key].next(this._items[key] ?? []);
                }
                else{ //do for the single item
                    if(this.handleFilterCacheChanges(items as T,key, filterAndKey[1], operation))
                        this.items[key].next(this._items[key] ?? []);
                }
            }
        }
        if(paginationByKeys.length > 0){
            //PAGINATION 
            let validPaginationKeys : string[] = []
            let firstPageKeys = paginationByKeys.filter(pk=> pk[1][0].previousPageLastItemUid == null).map(e=> e[0])
            if(firstPageKeys.length > 0 ){
                //add the elements to the first page, but update  or delete also in current subset (if found)
                validPaginationKeys.push(firstPageKeys[0]);
                if(this.subsetKey != firstPageKeys[0] && operation != "C") //if the operation is "C", just in the first page.
                    validPaginationKeys.push(this.subsetKey);
                    for(var key of validPaginationKeys){
                        if(items instanceof Array){ //do for each item
                            let pendingChanges = false;
                            for(var item of items){
                                pendingChanges = this.handleCommonKeyCacheChanges(item,key, operation, "HEAD");
                            }
                            if(pendingChanges)
                                this.items[key].next(this._items[key] ?? []);
                        }
                        else{ //do for the single item
                            if(this.handleCommonKeyCacheChanges(items as T,key, operation, "HEAD"))
                                this.items[key].next(this._items[key] ?? []);
                        }
                    }    
            }
            else{
                console.warn("Cannot find the firstPage from paginationKeys")
            }
        }
    }


    private handleFilterCacheChanges(item: T, key: string, filter: PropertyFilter<any> | [PropertyFilter<any>, EntityFilterOperator | null][], operation: "C"|"U"|"D"):  boolean{
        let pendingChanges = false;
        if(isMatchingFilter(item, filter) || key == allItemsSetKey){
            if(this._items[key]){ //allItemsSetKey could not exists right now and so we need to download data after, and not set new data there.
                var index = this._items[key].findIndex(i => i.uid == item.uid);
                if(index == -1 && (operation == "C" || operation == "U")){ //new item that satisfy the filter or item updated to sotisfy the filter
                    this._items[key].push(item);
                    pendingChanges = true;
                }
                else if(operation == "U") { //updated some prop of the item that satisfy the filter
                    this._items[key][index] = item;
                    pendingChanges = true;
                }
                else if(operation == "D"){ //delete the item from the cache of the current filter.
                    this._items[key].splice(index,1);
                    pendingChanges = true;
                }
            }
        }
        else{
            if(operation == "U"){ //we can find item to delete cause of no filter match only if a property that changes the mattch has changed.
                var index = this._items[key].findIndex(i => i.uid == item.uid);
                if(index != -1){
                    this._items[key].splice(index,1);
                    pendingChanges = true;
                }
            }
        }
        return pendingChanges;
    }


    private handleCommonKeyCacheChanges(item: T, key: string, operation: "C"|"U"|"D", creationStrategy: "HEAD"|"TAIL" = "TAIL"):  boolean{
        let pendingChanges = false;
        if(this._items[key]){ //allItemsSetKey could not exists right now and so we need to download data after, and not set new data there.
            var index = this._items[key].findIndex(i => i.uid == item.uid);
            if(index == -1 && (operation == "C")){ //new item that satisfy the filter or item updated to sotisfy the filter
                if(creationStrategy == "TAIL")
                    this._items[key].push(item);
                else if (creationStrategy == "HEAD")
                    this._items[key].unshift(item);
                pendingChanges = true;
            }
            else if(index != -1 && operation == "U") { //updated some prop of the item that satisfy the filter
                this._items[key][index] = item;
                pendingChanges = true;
            }
            else if(index != -1 && operation == "D"){ //delete the item from the cache of the current filter.
                this._items[key].splice(index,1);
                pendingChanges = true;
            }
        }
        return pendingChanges;
    }


}
