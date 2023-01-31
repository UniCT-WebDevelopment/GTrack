import { FormControl, FormControlOptions, FormGroup, MaxLengthValidator, Validators } from "@angular/forms";
import { TableColumn } from "../../models/componentModels";


export function getFormGroupFromTableColumnsMap(emptyObject: any,columns: Map<string,TableColumn>) : FormGroup{
  var obj : {[key:string]: FormControl | FormGroup} = {}
  let columnsWithValues = Object.fromEntries(Array.from(columns.keys()).map(key=> [key,null]))
  let nullObject = makeLeafNull(emptyObject);
  var mergedObj = {...columnsWithValues, ...nullObject}
  let itemExists = mergedObj['uid'] ? true : false
  for(var c of Object.keys(mergedObj)){
    if(columns.get(c)?.immutableIfDefined){
      console.log(mergedObj[c])
    }
    obj[c] = constructFormControl(obj[c], columns.get(c),itemExists)
  }
  return new FormGroup(obj)
}

export function getFormGroupFromItemWithColumnSpecification(item: any, columns: Map<string,TableColumn>, emptyObject: any) : FormGroup{
  var obj : {[key:string]: FormControl | FormGroup} = {}
  let nullObject = makeLeafNull(emptyObject);
  let columnsWithValues = Object.fromEntries(Array.from(columns.keys()).map(key=> [key,null]))
  var mergedObj = {...columnsWithValues, ...nullObject, ...item,}
  let itemExists = mergedObj['uid'] ? true : false
  for(var c in mergedObj){
    obj[c] = constructFormControl(mergedObj[c], columns.get(c),itemExists)
  }
  return new FormGroup(obj)
}




function constructFormControl(obj: any, column: TableColumn | undefined, itemExists: boolean) : FormControl | FormGroup{
  let control : FormControl | FormGroup
  if(obj instanceof Object && !(obj instanceof Date) && !(obj instanceof Array)){
    var nestedObj : {[key:string]: FormControl | FormGroup} = {}
    for(var e in obj){
      nestedObj[e] = constructFormControl(obj[e], column, itemExists); 
    }
    control = new FormGroup(nestedObj)    
  }
  else{
    control = new FormControl(obj, column?.validators as FormControlOptions ?? []) 
    if(itemExists && column?.immutableIfDefined){
      control.disable()
    }
  }
  return control;
}

function makeLeafNull(item: any ): any{
  let entries = Object.entries(item);
  for(var couple of entries){
    let obj = couple[1];
    if(obj instanceof Object && !(obj instanceof Date) && !(obj instanceof Array)){
      item[couple[0]] = makeLeafNull(obj);
    }
    else item[couple[0]] = null;
  }
  return item;
}


export function getFormGroupFromTableColumns(columns: TableColumn[]) : FormGroup{
  var obj : {[key:string]: FormControl} = {}
  for(var c of columns){
    obj[c.columnId] = new FormControl(null, c.validators as FormControlOptions)
  }
  return new FormGroup(obj)

}