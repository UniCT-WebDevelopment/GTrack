import { IdentificableItem } from '../models/IdentificableItem';
import { CrudService } from './crud.service';
import { PropertyFilter, EntityFilterOperator, PropertyFilterMatchCriteria } from '../filters/filtering/PropertyFilter';
import { ItemsPaginator } from '../filters/pagination/ItemsPaginator';
import { PropertySorter } from '../filters/sorting/PropertySorting';
import { HttpClient } from '@angular/common/http';
import { ApiAuthService } from 'src/app/modules/auth/auth.service.api';
import { getFilterKey } from '../filters/filters.helper';
import { getBaseUrl } from 'src/main';


export abstract class ApiService<T extends IdentificableItem> extends CrudService<T> {
    abstract entityName: string
    contextFilter: PropertyFilter<any> | null = null;

    constructor(private httpClient: HttpClient, private authService: ApiAuthService) {
        super();
    }

    protected getUrl(): string {
        return getBaseUrl() + this.entityName;
    }

    public override setQueryContext(parentEntityName: string, parentId: string, context: string, nestRecursively: boolean = false) {
        this.contextFilter = new PropertyFilter<any>(parentEntityName, parentId);
        this.subsetKey = getFilterKey(this.contextFilter);
        this.entityName = context;
    }

    //method to communicate with Backend
    protected override async createItemInternal(item: T): Promise<T | undefined> {
        let token = await this.authService.getUserToken();
        return new Promise<T | undefined>((res, rej) => {
            var newItem: any = { ...item };
            if (this.contextFilter) {
                newItem[this.contextFilter.key] = this.contextFilter.value;
            }
            this.httpClient.post<T>(this.getUrl() + "/Create", newItem, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : token
                }
            }).subscribe(r => {
                let item = r as T
                if (item)
                    res(this.withDeserializedDates(item))
                else
                    rej(new Error("Error calling api."));
            })
        })
    }


    protected override async readItemsInternal(): Promise<T[] | undefined> {
        
        if(this.contextFilter){
            return this.readFilteredItemsInternal(null, this.contextFilter);
        }
        let token = await this.authService.getUserToken();
        return new Promise<T[] | undefined>((res, rej) => {
            this.httpClient.get<T[]>(this.getUrl() + "/all", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : token
                }
            }).subscribe(r => {
                let items = r as T[]
                if (items)
                    res(items.map(i => this.withDeserializedDates(i)))
                else
                    rej(new Error("Error calling api."));
            })
        })
    }

    protected override readPaginatedItemsInternal(item: T | null, paginationOptions: [ItemsPaginator, PropertySorter[] | null]): Promise<T[] | undefined> {
        throw new Error("Not implemented");
    }

    private getCompositeFilter(filters: [PropertyFilter<any>, EntityFilterOperator | null][] | PropertyFilter<any>): any[] {
        if (filters instanceof Array) {
            return filters.map(tuple => ({
                filter: tuple[0],
                op: tuple[1]?.toString() ?? null
            }))
        }
        else {
            return [{
                filter: filters,
                op: null
            }]
        }
    }

    protected override async readFilteredItemsInternal(item: T | null, filters: [PropertyFilter<any>, EntityFilterOperator | null][] | PropertyFilter<any>): Promise<T[] | undefined> {
        if(this.contextFilter){
            if(filters instanceof PropertyFilter){
                filters = [
                    [filters, EntityFilterOperator.AND],
                    [this.contextFilter,null]
                ]
            }
            else if (filters instanceof Array){
                filters[filters.length-1][1] = EntityFilterOperator.AND;
                filters.push([this.contextFilter,null]);
            }
        }
        let token = await this.authService.getUserToken();
        return new Promise<T[] | undefined>((res, rej) => {
            let compositeFilter = this.getCompositeFilter(filters);
            this.httpClient.post<T[]>(this.getUrl() + "/filtered", JSON.stringify(compositeFilter), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : token
                }
            }).subscribe(r => {
                let items = r as T[]
                if (items)
                    res(items.map(i => this.withDeserializedDates(i)))
                else
                    rej(new Error("Error calling api."));
            })
        });
    }

    protected override async readItemInternal(item: T): Promise<T | undefined> {
        let token = await this.authService.getUserToken();
        return new Promise<T | undefined>((res, rej) => {
            this.httpClient.get<T>(this.getUrl() + "/" + item.uid, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : token
                }
            }).subscribe(r => {
                let item = r as T
                if (item)
                    res(this.withDeserializedDates(item))
                else
                    rej(new Error("Error calling api."));
            })
        })
    }

    protected override async updateItemInternal(item: T): Promise<boolean> {
        let token = await this.authService.getUserToken();
        return new Promise<boolean>((res, rej) => {
            var newItem: any = { ...item };
            if (this.contextFilter) {
                newItem[this.contextFilter.key] = this.contextFilter.value;
            }
            this.httpClient.put(this.getUrl() + "/Update", item, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : token
                }
            }).subscribe(r => {
                if (r)
                    res(true)
                else
                    res(false)
            })
        })
    }


    protected override async deleteItemInternal(item: T): Promise<boolean> {
        let token = await this.authService.getUserToken();
        return new Promise<boolean>((res, rej) => {
            this.httpClient.delete(this.getUrl() + "/Delete", {
                body: item, headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : token
                }
            }).subscribe(r => {
                if (r)
                    res(true)
                else
                    res(false)
            })
        })
    }



    protected override updateItemsInternal(items: T[]): Promise<boolean> {
        return new Promise<boolean>((res) => {
            let promises: Promise<boolean>[] = [];
            for (let item of items) {
                promises.push(this.updateItemInternal(item));
            }
            Promise.all(promises).then(result => res(result.every(r => r == true)))
        })
    }

    protected withDeserializedDates(item: T): T {
        let empty = this.getFakeEntityObject();
        return this.convertDates(item, empty);
    }

    private convertDates(item: any, empty: any): any {

        for (let key in item) {
            if (item[key] && empty[key] instanceof Date)
                item[key] = new Date(item[key]);
            else if (item[key] && !(item[key] instanceof Array) && item[key] instanceof Object) {
                item[key] = this.convertDates(item[key], empty[key]);
            }
            else if (item[key] && item[key] instanceof Array) {
                item[key] = item[key].map((nested: any) => this.convertDates(nested, {}))
            }
        }
        return item;
    }

    protected override deleteItemsInternal(items: T[]): Promise<boolean> {
        return new Promise<boolean>((res) => {
            let promises: Promise<boolean>[] = [];
            for (let item of items) {
                promises.push(this.deleteItemInternal(item));
            }
            Promise.all(promises).then(result => res(result.every(r => r == true)))
        })
    }

    protected override createItemsInternal(items: T[]): Promise<T[] | undefined> {
        return new Promise<T[] | undefined>((res) => {
            let promises: Promise<T | undefined>[] = [];
            for (let item of items) {
                promises.push(this.createItemInternal(item));
            }
            Promise.all(promises).then(result => {
                let elems = (result as (T | undefined)[])
                let eelems = elems.filter(e => e != undefined) as T[]
                res(eelems)
            })
        })
    }
}
