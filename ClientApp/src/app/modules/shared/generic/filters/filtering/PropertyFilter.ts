import { CrudService } from "../../services/crud.service";
import { IdentificableItem } from "../../models/IdentificableItem";

export class PropertyFilter<T>{
    key: string
    value: T
    matchCriteria: PropertyFilterMatchCriteria
    subContext: string | null

    constructor(key:string, value: T, matchCriteria: PropertyFilterMatchCriteria = PropertyFilterMatchCriteria.EQUALS, subContext: string|null = null){
        this.key = key;
        this.value = value;
        this.matchCriteria = matchCriteria
        this.subContext = subContext
    }
}

//instance used to describe how to construct a filter
//T is the item, K is the propertyType
export class DynamicPropertyFilter<T extends IdentificableItem, K>{
    key: string
    relatedItemKey: string
    matchCriteria: PropertyFilterMatchCriteria
    subContext: string | null

    constructor(key:string, relatedItemKey: string,matchCriteria: PropertyFilterMatchCriteria = PropertyFilterMatchCriteria.EQUALS, subContext: string|null = null){
        this.key = key;
        this.relatedItemKey = relatedItemKey;
        this.matchCriteria = matchCriteria;
        this.subContext = subContext
    }

    getFilter(relatedItem: T) : PropertyFilter<K>{
        let value = (relatedItem as any)[this.relatedItemKey]
        return new PropertyFilter(this.key,value, this.matchCriteria, this.subContext)
    }
}

export enum EntityFilterOperator{
    AND, 
    OR
}

export enum PropertyFilterMatchCriteria{
    EQUALS = "==", 
    GT = ">=",
    LT = "<=",
    NE = "!=",
    IN = "in"
}
