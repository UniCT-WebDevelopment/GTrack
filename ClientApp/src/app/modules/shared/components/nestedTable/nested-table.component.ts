import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Type, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BehaviorSubject } from 'rxjs';
import { ListItemsController } from 'src/app/modules/shared/generic/controllers/list-items.controller';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { IdentificableItem } from '../../generic/models/IdentificableItem';
import { PropertyFilter } from '../../generic/filters/filtering/PropertyFilter';
import { getFilterForEntity, getFilterKey, getFilterKeyForEntity } from '../../generic/filters/filters.helper';
import { ListItemsControllerWrapper } from '../../generic/wrappers/list-items.controller.wrapper';
import { allItemsSetKey } from '../../GlobalConstants';
import { TableItem } from './models';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'nested-table',
	templateUrl: './nested-table.component.html',
	styleUrls: ['./nested-table.component.scss']
})
export class NestedTableComponent<T extends IdentificableItem, K extends IdentificableItem>  implements OnInit, AfterViewInit{	
	//configuration parameters
	@Input() allowEdit = false;
	@Input() allowDelete = false;
	@Input() allowCreate = false;
	@Input() showSearchBar = false;
	@Input() showLeafSelection = false;
	@Input() tableItem: TableItem<T, K> | null = null;
	@Input() showSingleLeaf : boolean = true;
	@Input() selectablePredicate : (item: K) => boolean = () => true;

	expandedRows : {[key:string] : boolean} = {}
	//two way binding
	@Input() selectedItems : K[] = []
	@Output() selectedItemsChange  = new EventEmitter<K[]>();

	@Output() subsetKeyChange = new EventEmitter<string>();


	protected controller: ListItemsController<T> | null = null; //this should be a service in this case, but if it's a service i cannot pass the entityType as generic.
	@ViewChild("dt", {static:false}) dt : Table = {} as Table;

	constructor(
		private cs : ConfirmationService,
		public r: Router,
		public utilsServ : UtilsService,
		protected aro: ActivatedRoute,
		private trans: TranslateService
	) {}

	ngAfterViewInit(): void {
		this.controller!.dt = this.dt;
	}

	async ngOnInit(): Promise<void> {
		if(this.tableItem == null)
			throw new Error('Cannot use NestedTable Component without any TableItem root.');
		if(!this.tableItem.entityService){
			throw new Error('Cannot use NestedTable Component without any entityService. Check the passed data.');
		}
		this.controller = new ListItemsControllerWrapper<typeof this.tableItem.entityType>(this.tableItem.entityService,this.tableItem.dialogService,this.cs,this.r,this.utilsServ,this.aro,this.trans,this.tableItem.entityName,this.tableItem.labeledIdentifierField,this.tableItem.labeledEntityName,this.tableItem.labeledDialogTitle,this.tableItem.cols, this.tableItem.mappingLists ?? {}, this.tableItem.subsetKey, this.tableItem.initFilters, false, this.tableItem.paginatorSelectedDate, this.tableItem.dateFilteringPropertyKey)
		this.controller.setSubsetKey(this.tableItem.subsetKey);

		this.controller.subsetKeyChange.subscribe(k => this.subsetKeyChange.emit(k));

		await this.controller.ngOnInit();
	}

	showNestedClicked(item: T){
		if(this.showSingleLeaf){
			if(!this.expandedRows[item.uid]){
				this.expandedRows = {};
				this.expandedRows[item.uid] = true;
			}
			else
				 this.expandedRows = {};
		}
		else{
			this.expandedRows[item.uid] = !this.expandedRows[item.uid];
		}

		let filter = this.tableItem!.childPropertyFilter.getFilter(item);
		let filterKey = getFilterKey(filter);
		//for a timing reason it needs to be created. The wrapper creates it into the constructor, but it seems to be called after the ui shows the element, and this method is called before. 
		if(!this.tableItem!.children!.entityService.items[filterKey]){
			this.tableItem!.children!.entityService.items[filterKey] = new BehaviorSubject<K[] | undefined | null>(undefined);
		}
		this.tableItem?.children?.entityService.items[filterKey].next(undefined);

		let listsPromises : Promise<any>[] = [];
		let lists : {[key:string]: BehaviorSubject<IdentificableItem[] | null | undefined>} = this.tableItem!.children!.mappingLists ?? {};
		if(this.tableItem!.childDynamicMappingLists){
			for(var listFilter of Object.entries(this.tableItem!.childDynamicMappingLists)){
				let dl = listFilter[1];
				let filter = dl.getFilter(item);
				let filterKey = getFilterKey(filter);
				listsPromises.push(dl.entityService.getFilteredItems(null,filter));
				lists[listFilter[0]] = dl.entityService.items[filterKey]
			}
		}

		this.tableItem!.children!.mappingLists = lists;
		//otherwise it will calculated after (ui freeze).
		if(listsPromises.length > 0 )
			Promise.all(listsPromises).then(r => this.tableItem?.children?.entityService.getFilteredItems(null, filter).then(r => {}));
		else
		this.tableItem?.children?.entityService.getFilteredItems(null, filter).then(r => {})
	}


	getChildCacheKey(item: T){
		let filter = this.tableItem!.childPropertyFilter.getFilter(item);
		let filterKey = getFilterKey(filter);
		return filterKey;
	}


	selectionChange(items : K[]){
		this.selectedItems = items;
		this.selectedItemsChange.emit(items);
	}
}
