import { BehaviorSubject } from "rxjs";
import { IdentificableItem } from "../../generic/models/IdentificableItem";
import { DynamicPropertyFilter } from "../../generic/filters/filtering/PropertyFilter";
import { CrudService } from "../../generic/services/crud.service";
import { DialogService } from "../../generic/services/dialog.service";
import { LocalTableFilter, TableColumn } from "../../models/componentModels";
import { DynamicMappingList } from "../../generic/mapping/models";

export interface NestedTableItem<T extends IdentificableItem> extends CommonTableItemProps<T> {
    children: NestedTableItem<T> | null
}

export interface TableItem<T extends IdentificableItem, K extends IdentificableItem> extends TableItemProps<T>, CommonTableItemProps<T> {
    children: NestedTableItem<K> | null
}

interface TableItemProps<T extends IdentificableItem> {
    subsetKey: string,
    childDynamicMappingLists?: {[key:string]: DynamicMappingList<T>},
    childPropertyFilter: DynamicPropertyFilter<T,any>
}

interface CommonTableItemProps<T extends IdentificableItem>{
    entityType: T, 
    entityService: CrudService<T>,
    cols: TableColumn[],
    labeledIdentifierField: string;
	entityName: string,
    labeledEntityName: string,
    labeledDialogTitle: string,
    dialogService: DialogService<T> | null 
    initFilters: LocalTableFilter[],
    mappingLists?: {[key:string]: BehaviorSubject<any[] | null | undefined>},
    paginatorSelectedDate? : Date
	dateFilteringPropertyKey? : string
    showDatesPaginator : boolean;

}
