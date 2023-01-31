import { DynamicPropertyFilter, EntityFilterOperator, PropertyFilter } from "../filters/filtering/PropertyFilter"
import { IdentificableItem } from "../models/IdentificableItem"
import { CrudService } from "../services/crud.service"

export class DynamicMappingList<T extends IdentificableItem>{
    entityService: CrudService<any>
    propertyFilter: [DynamicPropertyFilter<T,any>, EntityFilterOperator|null][] | DynamicPropertyFilter<T,any> 
    constructor(es: CrudService<any>, propFilter:[DynamicPropertyFilter<T,any>, EntityFilterOperator|null][] | DynamicPropertyFilter<T,any> ){
        this.entityService = es;
        this.propertyFilter = propFilter;
    }

    getFilter(relatedItem: T) : [PropertyFilter<any>,EntityFilterOperator|null][] | PropertyFilter<any>{
        let filter : [PropertyFilter<any>,EntityFilterOperator|null][] | PropertyFilter<any> = [];
        if(this.propertyFilter instanceof Array){
            for(var couple of this.propertyFilter){
               let fl = couple[0].getFilter(relatedItem);
               filter.push([fl,couple[1]]);
            }
        }
        else filter = (this.propertyFilter as DynamicPropertyFilter<T,any>).getFilter(relatedItem);
        return filter;
    }

}

export class DynamicMapping<T extends IdentificableItem>{
    entityService: CrudService<T>
    listName: string
    mappingKeys: string[]
    constructor(es: CrudService<T>, listName: string, mappingKeys: string[] ){
        this.entityService = es;
        this.listName = listName;
        this.mappingKeys = mappingKeys;
    }
}