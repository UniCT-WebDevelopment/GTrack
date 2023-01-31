import { Validators } from "@angular/forms"
import { FilterMatchMode } from "primeng/api"
import { BehaviorSubject } from "rxjs"
import { DynamicPropertyFilter, PropertyFilter, EntityFilterOperator } from "../generic/filters/filtering/PropertyFilter"
import { IdentificableItem } from "../generic/models/IdentificableItem"

export interface TableConfig<T extends IdentificableItem>{
    emptyObject: T,
    cols: TableColumn[]
}

//TODO: add editable
			//TODO: change editType with dataType
			//TODO: change immutable with immutableIfDefined

export interface TableColumn {
    //unique id
    columnId: string,
    //display options
    displayName: string, 
    dataType?: EditType,
    measureUnit?: string,
    immutableIfDefined?: boolean,
    editable?: boolean,
    //mapping options
    sourceListName?: string,
    sourceKey?: string,
    mappedKey? : string,
    //calculation options
    routerLink ?: string,
    calculationFunction ?: (item: any, lists: {[key: string]: BehaviorSubject<any[] | null | undefined>}) => any;
    calculatedRouterLink?: (item: any) => any,
    validators ?: Validators[],
    nestedCols?: TableColumn[]
    propertyAggregationFunction?: (item: any) => any
    dynamicValidatorsFunction? : (item:any) => DynamicValidator[]
    
}

export abstract class DynamicValidator {
    private value: any
    constructor(value: any){
        this.value = value;
    }
    getValue() : any {
        return this.value;
    }
    
}

export class MinDateValidator extends DynamicValidator {
    constructor(date: Date){
        super(date)
    }
}

export class MaxDateValidator extends DynamicValidator {
    constructor(date: Date){
        super(date)
    }
}

export class ReadonlyValidator extends DynamicValidator {
    constructor(disabled: boolean){
        super(disabled)
    }
}



export type EditType = "text" |"lwctext"|"upctext"| "comboBox" | "none" | "documents" | "document" | "date" | "number" | "currency" | "phoneNumber" | "address" | "customer" | "expiration" | "genericPicker"

export interface LocalTableFilter{
    columnId: string,
    value: any,
    matchCriteria?: FilterMatchMode
}

export interface LocalTableFilterOption{
    name: string, 
    value: any
}

export interface DetailsRoute<T extends IdentificableItem>{
    route: string,
    icon?: string, 
    filter: [DynamicPropertyFilter<T,any> | PropertyFilter<any>, EntityFilterOperator|null][] | DynamicPropertyFilter<T,any>
}