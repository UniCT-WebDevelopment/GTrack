import { ActivatedRouteSnapshot } from "@angular/router";
import { filter } from "rxjs";
import { allItemsSetKey } from "../../GlobalConstants";
import { IdentificableItem } from "../models/IdentificableItem";
import { EntityFilterOperator, PropertyFilter } from "../filters/filtering/PropertyFilter";
import { getFilterForEntity, getFilterFromKey, getFilterKey, getFilterKeyForEntity, getPaginationKeyForEntity, getPaginationOptionsForEntity } from "../filters/filters.helper";
import { ItemsPaginator } from "../filters/pagination/ItemsPaginator";
import { PropertySorter } from "../filters/sorting/PropertySorting";

export function getManageControllerUrl(): string{
  var url = location.pathname.split("/");
  var baseControllerRoute = "";
  var editIndex = url.findIndex(seg => seg == "edit");
  if(editIndex != -1){
    var baseSegments = url.slice(0,editIndex - 1);
    baseControllerRoute = baseSegments.map(s => s).join("/");
  }
  return baseControllerRoute;
}

export function getAbsolutePathFromRelative(currentUrl: string, relativePath: string){
  var splittedRelative = relativePath.split("/");
  var i = 0;
  while(splittedRelative[i] == '..')
    i++;
  var basePath = currentUrl.split("/").slice(1,i).join("/").trim();
  var lastPathPart = relativePath.split("/").slice(i).join("/").trim();
  
  var finalPath =  basePath + "/" + lastPathPart;
  if(finalPath[finalPath.length-1] == '/') finalPath = finalPath.substring(0,finalPath.length-1);
  return finalPath;

}

export function getEntityName(url: string) : string{
  var splitted = url.split("/");
  if(url.endsWith("edit"))
    return splitted[splitted.length - 2];
  else return splitted[splitted.length - 3];
}


export function GetFilterKeyFromRoute<T extends IdentificableItem>(entity: T, route: ActivatedRouteSnapshot) : string{
  var filter = GetFilterFromRoute<T>(entity,route);
  if(filter == null)
    return allItemsSetKey;
  return getFilterKeyForEntity<T>(entity,filter);
}

export function GetPaginationKeyFromRoute<T extends IdentificableItem>(entity: T, route: ActivatedRouteSnapshot) : string{
  var paginationOptions = GetPaginationOptionsFromRoute<T>(entity,route);
  if(paginationOptions == null)
    return allItemsSetKey;
  return getPaginationKeyForEntity<T>(entity,paginationOptions);
}

export function GetFilterFromRoute<T extends IdentificableItem>(entity: T,route: ActivatedRouteSnapshot) : ([PropertyFilter<any>, EntityFilterOperator | null][] | PropertyFilter<any>) | null{
  var filterKey = route.paramMap.get("filterKey");
  if(filterKey){
    var filter = getFilterForEntity<T>(entity,filterKey)
    return filter;
  }
  else return null;
}

export function GetPaginationOptionsFromRoute<T extends IdentificableItem>(entity: T,route: ActivatedRouteSnapshot) : [ItemsPaginator,PropertySorter[] | null] | null{
  var paginationKey = route.paramMap.get("paginationKey");
  if(paginationKey){
    var filter = getPaginationOptionsForEntity<T>(entity,paginationKey)
    return filter;
  }
  else return null;
}