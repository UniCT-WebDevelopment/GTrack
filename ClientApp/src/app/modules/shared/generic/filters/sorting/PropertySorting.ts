export class PropertySorter{
    key: string
    sortType: PropertySortingType

    constructor(key:string, sortType: PropertySortingType = PropertySortingType.ASC){
        this.key = key;
        this.sortType = sortType
    }
}

export enum PropertySortingType{
    ASC, 
    DESC
}