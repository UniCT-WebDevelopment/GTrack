import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, FilterMatchMode, FilterMetadata, Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { LocalTableFilterOption, LocalTableFilter, TableColumn } from 'src/app/modules/shared/models/componentModels';
import { allItemsSetKey } from '../../GlobalConstants';
import { UtilsService } from '../../Utils';
import { IdentificableItem } from '../models/IdentificableItem';
import { EntityFilterOperator, PropertyFilter, PropertyFilterMatchCriteria } from '../filters/filtering/PropertyFilter';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';
import { getFilterFromKey, getFilterKey, getPaginationKey, getPaginationOptionsFromKey } from '../filters/filters.helper';
import { GetFilterFromRoute, GetFilterKeyFromRoute, getManageControllerUrl } from '../helpers/routing.helper';
import { EntityMappingController } from './entity-mapping.controller';
import { BehaviorSubject, distinct, Subject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { PaginationDateInterval } from '../../components/datePaginator/models/models';
import { ItemsPaginator } from '../filters/pagination/ItemsPaginator';
import { PropertySorter } from '../filters/sorting/PropertySorting';
import { DynamicMapping } from '../mapping/models';

@Component({
	template: ''
})
export abstract class ListItemsController<T extends IdentificableItem> extends EntityMappingController<T> implements OnInit, OnDestroy {
	abstract entityName: string;
	abstract labeledEntityName: string;
	abstract labeledIdentifierField: string;
	abstract labeledDialogTitle: string;
	abstract override cols: TableColumn[];
	override emptyObject: T;
	
	subscriptions : Subscription[] = []

	subsetKey: string = allItemsSetKey
	@ViewChild("dt", {static:false}) dt : Table = {} as Table;
	waitingData = true;
	msgs: Message[] = [];
	//Edit dialog props
	displayDialog = false;
	dialogTitle = ""
	selectedItems: T[] = []
	initFilters : LocalTableFilter[] = []
	tableFilters : { [s: string]: FilterMetadata | FilterMetadata[]} = {}
	canCreateItem : boolean = false;

	dataSource: BehaviorSubject<T[] | undefined | null> = new BehaviorSubject<T[] | undefined| null> (undefined);


	//used only if we use pagination by dates
	selectedDate : Date = moment().startOf('day').toDate();
	dateFilteringPropertyKey : string = "date"
	interval: PaginationDateInterval = PaginationDateInterval.Month
	filteringPropertyKeyByList : {[key:string] : string} = {}

	//used only if we use pagination by page - does not admit list changes.
	previousPage = 0;
	previousLastUidByPage : {[page:number] : string} = {}
	onAllLoaded : Subject<boolean> = new Subject<boolean>()

	//emitters
	subsetKeyChange : Subject<string> = new Subject<string>();

	dynamicMappings : DynamicMapping<any>[]|null = null

	constructor(
		public entityService: CrudService<T>,
		public dialogService: DialogService<T> | null,
		public confirmationService: ConfirmationService,
		private router: Router,
		public uss: UtilsService,
		protected aroute: ActivatedRoute,
		private trns: TranslateService
	) {
		super(uss);
		this.emptyObject = this.entityService.getFakeEntityObject();
	}
	ngOnDestroy(): void {
		for(let sub of this.subscriptions)
			sub.unsubscribe();
		this.subscriptions = [];
	}

	private async integrateMappingLists(items: T[]) : Promise<void>{ //add new items to mappingList downloading with IN operator. 
		//reloadMapping
		if(this.dynamicMappings){
			for(let dynamicMapping of this.dynamicMappings){
				if(!this.lists[dynamicMapping.listName]){
					this.lists[dynamicMapping.listName] = new BehaviorSubject<any[] |null | undefined>(undefined);
				}
				if(!items || items.length == 0)
				return;
				let keys = new Set<string>();
				for(let item of items){
					for(let key of dynamicMapping.mappingKeys){
						if((item as any)[key])
							keys.add((item as any)[key]);
					}
				}
				let uids = [...keys].filter(k => k);
				//download with property filter
				if(uids.length > 0){
					//TODO: make it as promise.all()
					let filter = new PropertyFilter("uid", uids, PropertyFilterMatchCriteria.IN)
					let mappedItems = await dynamicMapping.entityService.getFilteredItems(null, filter)
					if(mappedItems){
						let itemsToPush = mappedItems;
						if(this.lists[dynamicMapping!.listName].value){
							itemsToPush = [...new Set(mappedItems.concat(this.lists[dynamicMapping!.listName].value!))]
						}
						this.lists[dynamicMapping!.listName].next(itemsToPush)
					}
				}
			}
		}
	}

	override async ngOnInit(): Promise<void> {
		super.ngOnInit();
		//Table is directly subscribed to the observables of the entityService.
		this.subscribeToEntityService(this.subsetKey);
		let sub = this.dataSource.subscribe(items => {
			this.integrateMappingLists(items ?? []).then(() => {
				if(items == undefined)
				this.waitingData = true;
				if(items != undefined)
					this.waitingData = false;
				//preload all - The preload is necessary to handle calculated values and mappedvalues in view first init.
				for(var item of items ?? []){
					for(var col of this.cols){
						if(this.colsMap.get(col.columnId)){
							this.getPropertyLabeledValue(item, this.colsMap.get(col.columnId)!);
						}
					}
				}
			})
		})
		this.subscriptions.push(sub);
		if(this.dialogService != null){
			//show the dialog and reset the state so other components that will use the same service will not use the current displayDialog state, but will find it in an undefined state waiting for other messages.
			let sub1 = this.dialogService.showDialog.subscribe(show => { if (show != undefined) { this.displayDialog = show; this.dialogService?.showDialog.next(undefined) } })
			let sub2 = this.dialogService.onItemSave.subscribe(item => console.log("Dialog service item saved - item: ", item))
			this.subscriptions.push(sub1, sub2);
		}
		this.initializeFilters();
	}

	subscribeToEntityService(subsetKey: string){
		this.setSubsetKey(subsetKey);
		let sub = this.entityService.items[this.subsetKey].subscribe(items => this.dataSource.next(items));
		this.subscriptions.push(sub);
	}

	onDateChanges(date: Date){
		this.waitingData = true;
		this.selectedDate = date;
		//remove dates filter from the current filter and substitute with the new dates filters.
		let currentFilter : [PropertyFilter<any>,EntityFilterOperator | null][] | PropertyFilter<any> = []
		if(this.subsetKey != allItemsSetKey){
			let filter = getFilterFromKey(this.subsetKey)
			if(filter)
				currentFilter = filter
			else{
				console.warn("The current subsetKey is not a filterKey.")
			}
		}
		if(currentFilter instanceof Array){
			currentFilter = currentFilter.filter(couple => couple[0].key != this.dateFilteringPropertyKey);
		}
		let startDate = moment(date).startOf(this.interval).toDate();
		let endDate = moment(date).endOf(this.interval).toDate();
		let newFilter : [PropertyFilter<any>,EntityFilterOperator | null][] = [];
		let datesFilter : [PropertyFilter<any>,EntityFilterOperator | null][] =  [
			[new PropertyFilter<Date>(this.dateFilteringPropertyKey, startDate,  PropertyFilterMatchCriteria.GT),
			EntityFilterOperator.AND],
			[new PropertyFilter<Date>(this.dateFilteringPropertyKey, endDate, PropertyFilterMatchCriteria.LT), null]
		]
		if(currentFilter instanceof PropertyFilter){
			newFilter.push([currentFilter,EntityFilterOperator.AND])
		}
		else if (currentFilter instanceof Array && currentFilter.length > 0){
			newFilter = currentFilter;
			newFilter[newFilter.length-1][1] = EntityFilterOperator.AND;
		}
		newFilter = newFilter.concat(datesFilter);

		// //update lists
		// for(let filterInfo of Object.entries(this.filteringPropertyKeyByList)){
		// 	let listKey = filterInfo[0];
		// 	let filterProp = filterInfo[1];
		// 	let datesFilter : [PropertyFilter<any>,EntityFilterOperator | null][] =  [
		// 	[new PropertyFilter<Date>(filterProp, startDate,  PropertyFilterMatchCriteria.GT),
		// 	EntityFilterOperator.AND],
		// 	[new PropertyFilter<Date>(filterProp, endDate, PropertyFilterMatchCriteria.LT), null]
		// 	]
		// 	let filterKey = getFilterKey(datesFilter);
			
		// }





		let filterKey = getFilterKey(newFilter);
		//request new data.
		this.entityService.getFilteredItems(null, newFilter).then(() => {});
		//set the dataSource to the new filterKey.
		this.subscribeToEntityService(filterKey);
		this.subsetKeyChange.next(filterKey);
		//just wait, the magic will happen.
	}

	onPageChanges(page: number){
		this.waitingData = true;
		//remove dates filter from the current filter and substitute with the new dates filters.
		let currentPaginator : [ItemsPaginator, PropertySorter[]|null] = [new ItemsPaginator(10,null), null];
		if(this.subsetKey != allItemsSetKey){
			let paginationOpts = getPaginationOptionsFromKey(this.subsetKey)
			if(paginationOpts)
				currentPaginator = paginationOpts
			else{
				throw new Error("The current subsetKey is not a paginationKey.")
			}
		}
		let lastUid : string | null = null
		if(page == 0){
			lastUid = null;
			this.previousPage = 0;
		}
		else if(page > this.previousPage){ //check from the previous page if we have less items than the paginator number. so disable the button. 
			//go next, get the last uid from current cache. 
			if(this.dataSource.value && this.dataSource.value.length > 0){
				lastUid = this.dataSource.value[this.dataSource.value!.length-1].uid;
				this.previousLastUidByPage[page] = lastUid;
				this.previousPage = page-1;
			}
			else{
				this.waitingData = false;
				return;
			}
		}
		else if(page <= this.previousPage){
			lastUid = this.previousLastUidByPage[page];
			this.previousPage = page-1;
		}
		
		let newPaginator = currentPaginator;
		newPaginator[0].previousPageLastItemUid = lastUid;
		
		let pagnationKey = getPaginationKey(newPaginator);
		//request new data.
		this.entityService.getPaginatedItems(null, newPaginator).then((items) => {
			if(items && items.length < newPaginator[0].numberOfItems)
				this.onAllLoaded.next(true);
		});
		//set the dataSource to the new filterKey.
		this.subscribeToEntityService(pagnationKey);
		this.subsetKeyChange.next(pagnationKey);
		//just wait, the magic will happen.
	}

	setSubsetKey(key: string){
		this.subsetKey = key;
		if(!this.entityService.items[this.subsetKey]) 
			this.entityService.items[this.subsetKey] = new BehaviorSubject<T[] | null | undefined>(undefined);
		this.entityService.setSubsetKey(this.subsetKey);
	}



	initializeFilters(){
		for(var f of this.initFilters){
			this.tableFilters[f.columnId] = {value: f.value, matchMode : f.matchCriteria ?? FilterMatchMode.EQUALS} as FilterMetadata
		}
	}


	applySearchFilter(textEvent: string, searchCriteria: string ){
		return this.dt.filterGlobal(textEvent, searchCriteria);
	}

	getFilterOptions(field: string) : LocalTableFilterOption[] {
		var columnItem = this.colsMap.get(field);
		var accessField = columnItem?.calculationFunction ? this.getFakeCalculatedColumnId(field) : columnItem?.sourceKey ?? field; 
		var items = (this.entityService.items[this.subsetKey].value || []).map(t => ({ "name" : this.getPropertyLabeledValue(t,columnItem!), "value": (t as any)[accessField] ?? field}));
		return this.us.distinctByKey(items, "value");
	}

	getFilterField(col :TableColumn) : string{
		//we also can return the fake mapped or fake column or normal and modify getFilter options to return always the calculated value or mapped value of items. 
		//in this manner we will search for mappedvalue instead of uids, it should be the same.
		return col.calculationFunction ? this.getFakeCalculatedColumnId(col.columnId) : col.sourceKey ?? col.columnId
	}

	getFieldIds() {
		//returns ids and id of properties created by mapped columns
		return this.cols.map(c => c.mappedKey ? this.getFakeMappedColumnId(c.sourceKey ?? c.columnId) : c.calculationFunction ?  this.getFakeCalculatedColumnId(c.columnId) : c.columnId);
	}

	deleteClicked(item: T) {
		this.deleteItem(item);
	}


	deleteItem(item: T){
		//open delete confirm dialog
		this.confirmationService.confirm({
			message: this.trns.instant("common.deletion", {id: (item as any)[this.labeledIdentifierField]}),
			header: this.trns.instant("common.deletionHeader"),
			icon: 'pi pi-info-circle',
			accept: () => {
				this.entityService.deleteItem(item).then(res =>
					this.msgs = [{ severity: 'success', summary: this.trns.instant("common.confirmed"), detail: this.trns.instant("common.deletionAccepted", {id:(item as any)[this.labeledIdentifierField] })}]
				);
			},
			reject: () => {
				this.msgs = [{ severity: 'error', summary: this.trns.instant("common.rejected"), detail: this.trns.instant("common.deletionDenied", {id:(item as any)[this.labeledIdentifierField] })}];
			},
			key: "positionDialog"
		});
	}

	
	editClicked(item: T) {
		this.dialogTitle = "Edit " + this.entityName
		//do not push showDialog.
	}

	addClicked() {
		this.dialogTitle = "Add " + this.entityName
		//do not push showDialog.
	}

	editDialogClosed() {
		var baseUrl = getManageControllerUrl();
		if(baseUrl)
			this.router.navigateByUrl(baseUrl);
	}

	// showProperties(routerLink: string){
	// 	console.log("prova");
	// }
}