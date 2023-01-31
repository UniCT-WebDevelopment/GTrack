
import { CollectionReference, Query } from "@angular/fire/compat/firestore";
import { documentId, Timestamp, WhereFilterOp } from "@angular/fire/firestore";
import { EntityFilterOperator, PropertyFilter } from "../../filters/filtering/PropertyFilter";
import { IdentificableItem } from "../../models/IdentificableItem";

export function getFirestoreQuery<T extends IdentificableItem>(ref:CollectionReference<T>, filters: [PropertyFilter<any>, EntityFilterOperator | null][] | PropertyFilter<any>): Query<T> | Query<T>[] {
    let queries : Query<T>[] = []
    if (filters instanceof Array) {
      filters = filters.filter(f => !f[0].subContext);
      let q: Query<T> | null = null;
      for (let i = 0; i < filters.length; i++) {
        let filter = filters[i][0];
        let filterKey = filter.key == "uid" ? documentId() : filter.key;
        if (i > 0) {
          let operator = filters[i - 1][1];
          if (operator == EntityFilterOperator.OR){ //OR operator
            if(q)
              queries.push(q);
            q = ref.where(filterKey, filter.matchCriteria.valueOf() as WhereFilterOp, filter.value)
          }
          else { //AND operator
            if(!q)
              q = ref.where(filterKey, filter.matchCriteria.valueOf() as WhereFilterOp, filter.value)
            else
              q = (q as Query<T>).where(filterKey,filter.matchCriteria.valueOf() as WhereFilterOp, filter.value)
          }
        }
        else{ //first filter
          q = ref.where(filterKey, filter.matchCriteria.valueOf() as WhereFilterOp, filter.value)
        }
      }
      queries.push(q!);
    }
    else if (filters instanceof PropertyFilter) {
      let filterKey = filters.key == "uid" ? documentId() : filters.key;
      queries.push(ref.where(filterKey, filters.matchCriteria.valueOf() as WhereFilterOp, filters.value))
      if(!filters.subContext)
        queries.push(ref.where(filters.key, filters.matchCriteria.valueOf() as WhereFilterOp, filters.value))
    }
    return queries.length == 1 ? queries[0] : queries;
  }

  export function withUidAndConvertedDates<T extends IdentificableItem>(item: T, uid: string) : T{
    let newItem = {...item, uid: uid};
    return convertDates(newItem);
  }

  function convertDates(item: any) : any{
    for(let key in item){
      if(item[key] instanceof Timestamp)
        item[key] = (item[key] as Timestamp).toDate();
      else if (item[key] && !(item[key] instanceof Array) && item[key] instanceof Object){
        item[key] = convertDates(item[key]);
      }
      else if (item[key] && item[key] instanceof Array){
        item[key] = item[key].map((nested: any) => convertDates(nested))
      }
    }
    return item;
  }