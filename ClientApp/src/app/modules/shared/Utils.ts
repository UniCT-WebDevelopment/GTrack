import { Injectable, Type } from "@angular/core";
import { AngularFirestoreCollection, Query } from "@angular/fire/compat/firestore";
import { CollectionReference, WhereFilterOp } from "@angular/fire/firestore";
import { AbstractControl, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { PropertyFilter, EntityFilterOperator } from "./generic/filters/filtering/PropertyFilter";
import { IdentificableItem } from "./generic/models/IdentificableItem";

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  groupByKey(list: any[], key : string, omitKey=false) : {[key:string] : any[]}{
    return list.reduce((hash, {[key]:value, ...rest}) => ({...hash, [value]:( hash[value] || [] ).concat(omitKey ? {...rest} : {[key]:value, ...rest})} ), {})
  } 

  distinctByKey(list: any[], key: string) : any[]{
    return Object.entries(this.groupByKey(list,key)).map((i: any) => i[1][0]);
  }

  enumToObjects(enumerator: any){
    return Object.values(enumerator).map((k,i) => ({uid: k, value: k}))
  }

  getLabeledDate(date: Date | string){
    return moment(date).format("yyyy/MM/DD")
  }

  castToFormGroup(item: AbstractControl<any>) : FormGroup {
    return item as FormGroup;

  }

  isObjectEmpty(item: any) : boolean{
    if(!item)
      return true;
    let condition = true;
    for(let key in item){
      if(item[key]){
        condition = false;
        break;
      }
    }
    return condition;
  }

  groupBy<T extends IdentificableItem>(array: T[], f: {(item: T): T[]; (arg0: any): string[]; }) {
    var groups: {[key: string] : T[]} = {};
    array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    })
  }

  getFirestoreQuery<T>(ref:Query<T>, filters: [PropertyFilter<any>, EntityFilterOperator | null][] | PropertyFilter<any>): Query<T> {
    let q : Query<T> = ref;
    if (filters instanceof Array) {
      for (let i = 0; i < filters.length; i++) {
        let filter = filters[i][0];
        if (i > 0) {
          let operator = filters[i - 1][1];
          if (operator == EntityFilterOperator.OR)
            console.warn("Cannot filter by an OR operator. Skipping this filter");
          else {
            q = q.where(filter.key, filter.matchCriteria.valueOf() as WhereFilterOp, filter.value)
          }
        }
        else{
          q = q.where(filter.key, filter.matchCriteria.valueOf() as WhereFilterOp, filter.value)
        }
      }
    }
    else if (filters instanceof PropertyFilter) {
      q = q.where(filters.key, filters.matchCriteria.valueOf() as WhereFilterOp, filters.value)
    }
    return q;
  }
}