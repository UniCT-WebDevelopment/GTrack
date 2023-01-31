import { Component, OnInit, ViewChild } from '@angular/core'
import { BehaviorSubject } from 'rxjs';
import { TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from '../../Utils';
import { IdentificableItem } from '../models/IdentificableItem';

@Component({
	template: ''
})
export abstract class EntityMappingController<T extends IdentificableItem> implements OnInit{
	
	private notFoundKeys: Set<string> = new Set<string>();

	abstract cols: TableColumn[];
	abstract emptyObject: T
	colsMap : Map<string,TableColumn> = new Map();
	//used for items mapping (items that depends on other services entities)
	lists : {[key:string]: BehaviorSubject<any[] | null | undefined>} = {};

	constructor(public us: UtilsService) {}
	
	ngOnInit(): void {
		this.colsMap = new Map(this.cols.map(e => ([e.columnId,e])));
	}

	getListItemLabeledName(mappingKey: string, columnId: string, showWarnings: boolean = true) : any{
		if(!mappingKey)
			return mappingKey;
		var columnItem = this.colsMap.get(columnId);
		if(!columnItem) {
			if(showWarnings) console.warn("Cannot find column with column id : ", columnId);
			return mappingKey;
		}
		if(!columnItem.sourceListName) {
			if(showWarnings) console.warn("The column with column id : ", columnId, " has no sourceList.");
			return mappingKey;
		}
		if(!columnItem.mappedKey){
			if(showWarnings) console.warn("The column with column id : ", columnId, " has no mappedKey.");
			return mappingKey;
		}
		if(!columnItem.sourceKey){
			if(showWarnings) console.warn("The column with column id : ", columnId, " has no sourceKey. Using the columnId.");
		}

		if(this.lists && this.lists[columnItem.sourceListName]){
			let list = this.lists[columnItem.sourceListName].value;
			if(list == null)
				return mappingKey;
			else if(list == undefined) 
				console.warn("The list: "+ columnItem.sourceListName + " has the items subject in loading state (undefined). Please check if you have correctly set the resolver.")
			var mappedItem = list.find(i => i.uid == mappingKey)
			if(mappedItem)
				return mappedItem[columnItem.mappedKey];
		}
		else{
			return mappingKey; //first time loading might have undefined lists.
		}
		if(!this.notFoundKeys.has(mappingKey)){
			this.notFoundKeys.add(mappingKey);
			console.error("Consistency problem: The uid " + mappingKey + " was not found in the mappingList below:");
			console.error(this.lists[columnItem.sourceListName].value)
		}
		return mappingKey;
	}

	//this method returns the labeled name for each property of the input object. 
	getPropertyLabeledValue(item: T, col: TableColumn, editMode : boolean = false) : string{
		if(!col || !item)
			return "";
		if(col.calculationFunction){
			let calculatedValue = col.calculationFunction(item, this.lists); 
			(item as any)[this.getFakeCalculatedColumnId(col.columnId)] = calculatedValue;
			return calculatedValue;
		}
		var resultItem = this.getListItemLabeledName((item as any)[col.sourceKey ?? col.columnId],col.columnId,false);
		if(col.mappedKey){
			(item as any)[this.getFakeMappedColumnId(col.sourceKey ?? col.columnId)] = resultItem
		}
		if(resultItem instanceof Date)
			resultItem = this.us.getLabeledDate(resultItem);
		
		if(editMode == true){
			if(col.measureUnit && resultItem ){
				resultItem = resultItem + " " + col.measureUnit;
			}
			if(col.dataType == "currency" && resultItem){
				resultItem = resultItem + " €" 
			}
		}
		
		return resultItem;
	}

	protected getFakeMappedColumnId(originalColumnId: string) : string{
		return "_mappedValue_" + originalColumnId;
	}

	protected getFakeCalculatedColumnId(originalColumnId: string) : string{
		return "_calculatedValue_" + originalColumnId;
	}
}