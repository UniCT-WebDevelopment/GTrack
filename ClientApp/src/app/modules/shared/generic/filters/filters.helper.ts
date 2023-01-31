import { DynamicPropertyFilter, EntityFilterOperator, PropertyFilter, PropertyFilterMatchCriteria } from "./filtering/PropertyFilter";
import {Md5} from "md5-typescript";
import { IdentificableItem } from "../models/IdentificableItem";
import { allItemsSetKey } from "../../GlobalConstants";
import { ItemsPaginator } from "./pagination/ItemsPaginator";
import { PropertySorter, PropertySortingType } from "./sorting/PropertySorting";


export function getFilterKey(filters: ([PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any>) | [ItemsPaginator, PropertySorter[] | null]) : string{
  return btoa(JSON.stringify(filters));
  //Buffer.from(str, 'base64')
}

export function getPaginationKey(options: ([ItemsPaginator, PropertySorter[]|null])) : string{
  return btoa(JSON.stringify(options));
  //Buffer.from(str, 'base64')
}

export function getFilterKeyForEntity<T extends IdentificableItem>(entity: T, filters: ([PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any>)) : string{
  let entityFilter = getEntityFilter<T>(entity,filters);
  return btoa(JSON.stringify(entityFilter));
  //Buffer.from(str, 'base64')
}

export function getPaginationKeyForEntity<T extends IdentificableItem>(entity: T, options: ([ItemsPaginator, PropertySorter[]|null])) : string{
  let entityFilter = getEntityPaginationOptions<T>(entity,options);
  return btoa(JSON.stringify(entityFilter));
  //Buffer.from(str, 'base64')
}

export function getFilterForEntity<T extends IdentificableItem>(entity: T,filterKey: string) : [PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any> | null{
  let filter = getFilterFromKey(filterKey);
  if(filter)
    return getEntityFilter(entity,filter);
  else return null;
}

export function getPaginationOptionsForEntity<T extends IdentificableItem>(entity: T,key: string) : [ItemsPaginator, PropertySorter[]|null] | null{
  let paginationOpts = getPaginationOptionsFromKey(key);
  if(paginationOpts)
    return getEntityPaginationOptions(entity,paginationOpts);
  else return null;
}

export function getFilterFromKey(filterKey: string) : ([PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any>) | null{
  try{
    let resultFilter : [PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any> = []
    let obj = JSON.parse(atob(filterKey)) as [PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any>;
    if(obj instanceof Array){
        for(var i = 0; i < obj.length; i++){
          let couple = obj[i] as [PropertyFilter<any>, EntityFilterOperator|null];
          //IMPROVE: bad manner to check for "="
          let matchCrit : PropertyFilterMatchCriteria = couple[0].matchCriteria.toString() == "=" ? PropertyFilterMatchCriteria.EQUALS:  couple[0].matchCriteria 
          resultFilter.push([new PropertyFilter(couple[0].key, couple[0].value, matchCrit,couple[0].subContext), couple[1]]);
        }
        return resultFilter;
    }
    else{
       //IMPROVE: bad manner to check for "="
       let matchCrit : PropertyFilterMatchCriteria = obj.matchCriteria.toString() == "=" ? PropertyFilterMatchCriteria.EQUALS:  obj.matchCriteria
       return new PropertyFilter(obj.key, obj.value, matchCrit, obj.subContext); 
    } 
  }
  catch{
    return null;
  }
  
}


export function getPaginationOptionsFromKey(key: string) : [ItemsPaginator, PropertySorter[]|null] | null{
  try{
    let obj = JSON.parse(atob(key)) as [ItemsPaginator, PropertySorter[]|null]
    let paginator = new ItemsPaginator(obj[0].numberOfItems, obj[0].previousPageLastItemUid);
    let propertySorters: PropertySorter[]|null = null;
    if(obj[1] != null){
      propertySorters = [];
      for(var i = 0; i < obj[1].length; i++){
        propertySorters.push(new PropertySorter(obj[1][i].key, obj[1][i].sortType as PropertySortingType));
      }
    }
    if(!obj[0].numberOfItems || ! propertySorters)
      return null;
    return [paginator, propertySorters];
  }
  catch{
    return null;
  }
}

export function getFiltersByKeys(filterKeys: string[]) : [string, ([PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any>)][]{
  let filters = filterKeys.filter(fk => fk != allItemsSetKey).map(fk => [fk, getFilterFromKey(fk)]) as [string, ([PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any> | null)][]
  return filters.filter(f => f[1] != null) as [string, ([PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any>)][];
}

export function getPaginationOptionsByKeys(paginationKeys: string[]) : ([string, [ItemsPaginator, PropertySorter[] | null ]])[]{
  let paginators = paginationKeys.filter(fk => fk != allItemsSetKey).map(fk => [fk, getPaginationOptionsFromKey(fk)]) as [string, [ItemsPaginator, PropertySorter[] | null] | null][]
  return paginators.filter(f => f[1] != null) as ([string, [ItemsPaginator, PropertySorter[] | null ]])[];
}

export function getFilterValue(forPropertyKey: string, filters: [PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any> ) : string | null{
  let value : string | null = null;
  if(filters instanceof PropertyFilter && filters.key == forPropertyKey) value = filters.value;
  else if(filters instanceof Array){
    let correctFilter = filters.filter(f => f[0].key == forPropertyKey);
    if(correctFilter)
      value = correctFilter[0][0].value;
  }
  return value;
} 

export function getFilterFromDynamic<T extends IdentificableItem>(dynamicFilter: [DynamicPropertyFilter<T,any> | PropertyFilter<any>, EntityFilterOperator|null][] | DynamicPropertyFilter<T,any>, item: T) : [PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any>{
  let filter : [PropertyFilter<any>, EntityFilterOperator|null][] = []
  if(dynamicFilter instanceof DynamicPropertyFilter){
    return dynamicFilter.getFilter(item);
  }
  else if (dynamicFilter instanceof Array){ //array 
    for(var dfCouple of dynamicFilter){
      let candidate = dfCouple[0];
      if(candidate instanceof DynamicPropertyFilter)
        filter.push([candidate.getFilter(item), dfCouple[1]])
      else{ //normal filter
        filter.push([candidate,dfCouple[1]])
      }
    }
  }
  return filter;
}


function getEntityFilter<T extends IdentificableItem>(entity: T,filters: [PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any>) : [PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any>{
  const entityKeys = Object.keys(entity);
  let filterForEntity : [PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any> = []
  if(filters instanceof Array){
    //check wich filter has key contained in entityKeys
    for(var couple of filters){
        if((entityKeys as string[]).includes(couple[0].key) || couple[0].subContext){
          if((entity as any) [couple[0].key] instanceof Date){
            couple[0].value = new Date(couple[0].value); //dates are converted to iso string rapresentation by base64
          }
          filterForEntity.push(couple);//push the filter and eventually the operator.
        }
    }
  }
  else if (filters instanceof PropertyFilter){
    if((entityKeys as string[]).includes(filters.key) || filters.subContext){
      if((entity as any) [filters.key] instanceof Date){
        filters.value = new Date(filters.value); //dates are converted to iso string rapresentation by base64
      }
      filterForEntity = filters;//push the filter also.
    }
  }
  if(filterForEntity instanceof Array && filterForEntity.length == 1)
    return filterForEntity[0][0]; //just the property filter.
  return filterForEntity;
}

function getEntityPaginationOptions<T extends IdentificableItem>(entity: T,options: ([ItemsPaginator, PropertySorter[]|null])) :([ItemsPaginator, PropertySorter[]|null]) {
  if(options[1] == null)
    return options;
  else{
    let sortingKeys = options[1].map(sorter => sorter.key);
    const entityKeys = Object.keys(entity);
    for(var i = 0; i< sortingKeys.length; i++){
      if(!(entityKeys as string[]).includes(sortingKeys[i])){
        options[1]?.splice(i,1);
      }
    }
  }
  return options;
}


export function isMatchingFilter(item : any, filters:[PropertyFilter<any>, EntityFilterOperator|null][] | PropertyFilter<any>) :boolean {
    var condition : boolean = true;
      if(filters instanceof PropertyFilter){
          var fl = filters as PropertyFilter<any>;
          if(item[fl.key] == undefined){
            console.warn("cannot find the property " +fl.key+" in item during filtering.")
            condition = false
          }
          else
            condition = matchValue(item[fl.key], fl.value,fl.matchCriteria)
               
      }
      else if(filters instanceof Array){
          for(var i = 0; i< filters.length;i++){
              let fl = filters[i][0];
             
              if(i == 0){
                if(item[fl.key] === undefined){
                  console.warn("cannot find the property " +fl.key+" in item during filtering.")
                  condition = false
                }
                else
                  condition = matchValue(item[fl.key], fl.value,fl.matchCriteria)
              }
                
              else{
                  let prevOp = filters[i-1][1];
                  if(prevOp == EntityFilterOperator.AND){
                    if(item[fl.key] === undefined){
                      console.warn("cannot find the property " +fl.key+" in item during filtering.")
                      condition = condition && false
                    }
                    else
                      condition = condition && matchValue(item[fl.key], fl.value,fl.matchCriteria)
                  }
                      
                  else if(prevOp == EntityFilterOperator.OR){
                    if(item[fl.key] === undefined){
                      console.warn("cannot find the property " +fl.key+" in item during filtering.")
                      condition = condition || false
                    }
                    condition = condition || matchValue(item[fl.key], fl.value,fl.matchCriteria)
                  }
                     
              }
          }
      }
      return condition;
}


function matchValue(a: any, b: any, criteria: PropertyFilterMatchCriteria): boolean{
  let condition = false;
  if(a instanceof Date && !(b instanceof Date)) //date converted by base64 are converted to string representation.
    b = new Date(b);
  switch(criteria){
    case PropertyFilterMatchCriteria.EQUALS:
      condition = a == b    
    break;

    case PropertyFilterMatchCriteria.GT:
      condition = a >= b;    

    break;

    case PropertyFilterMatchCriteria.LT:
      condition = a <= b;    
    break;

    case PropertyFilterMatchCriteria.NE:
      condition = a != b    
    break;

    case PropertyFilterMatchCriteria.IN:
      condition = (b as Array<string>).includes(a);    
    break;
  }
  return condition;
}
