import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BehaviorSubject } from 'rxjs';
import { ListItemsController } from 'src/app/modules/shared/generic/controllers/list-items.controller';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { DetailsRoute, LocalTableFilter, TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { ManageItemsController } from '../../generic/controllers/manage-items.controller';
import { getFilterFromDynamic, getFilterKey } from '../../generic/filters/filters.helper';
import { getFormGroupFromItemWithColumnSpecification, getFormGroupFromTableColumns } from '../../generic/helpers/tableColumn.helper';
import { DynamicMapping } from '../../generic/mapping/models';
import { IdentificableItem } from '../../generic/models/IdentificableItem';
import { CrudService } from '../../generic/services/crud.service';
import { ListItemsControllerWrapper } from '../../generic/wrappers/list-items.controller.wrapper';
import { ManageItemsControllerWrapper } from '../../generic/wrappers/manage-items.controller.wrapper';
import { allItemsSetKey } from '../../GlobalConstants';


@Component({
	selector: 'manage-items',
	templateUrl: './manage-items.component.html',
	styleUrls: ['./manage-items.component.scss']
})
//This component is a generic component that can be instantiated from html passing the type of entity as an input property. 
export class ManageItemsComponent<T extends IdentificableItem> implements OnInit, AfterViewInit{


	@Input() subsetKey: string = allItemsSetKey
	
	//configuration parameters
	@Input() allowEdit = false;
	@Input() allowDelete = false;
	@Input() allowCreate = false;
	@Input() showSearchBar = false;
	@Input() showPaginator = false;
	@Input() showSelection = false;
	@Input() showDatesPaginator = false;
	@Input() showItemsPaginator = false;
	

	//necessary parameters for the controller
	@Input() entityType: T | null = null;  //used as parameter to resolve the angular lack of feature that does not allow to instantiate from html a generic component. 
	@Input() entityService: CrudService<T> | null = null;
 	@Input() dialogService: DialogService<T> | null = null;
	@Input() labeledIdentifierField: string = "";
	@Input() entityName: string = "";
	@Input() entityLabeledTitle: string = "";
	@Input() labeledDialogTitle: string = ""; //TO-DO TRANSLATION
	@Input() cols: TableColumn[] = []
	@Input() editCols?: TableColumn[]
	
	@Input() lists: {[key:string]: BehaviorSubject<any[]| null | undefined>} = {}
	@Input() initFilters : LocalTableFilter[] = []
	@Input() selectablePredicate : (item: T) => boolean = () => true;
	//it's a dynamic property filter or a propertyfilter anyway.
	@Input() detailsRoutes? : DetailsRoute<T>[] 
	@Input() paginatorSelectedDate : Date = moment().startOf('day').toDate();
	@Input() dateFilteringPropertyKey : string = "date"
	@Input() itemsPerPage : number = 100;

	@Input() dynamicMappings : DynamicMapping<any>[]|null = null

	
	
	//two way binding
	@Input() selectedItems : T[] = []
	@Output() selectedItemsChange  = new EventEmitter<T[]>();

	protected controller: ManageItemsController<T> | null = null; //this should be a service in this case, but if it's a service i cannot pass the entityType as generic.

	@ViewChild("dt", {static:false}) dt : Table = {} as Table;

	constructor(
		public cs: ConfirmationService,
		public r: Router,
		public fb: FormBuilder,
		public utilsServ : UtilsService,
		protected aro: ActivatedRoute,
		private trans: TranslateService
	) {}

	ngAfterViewInit(): void {
		this.controller!.dt = this.dt;
		this.controller!.selectedItems = this.selectedItems;
	}

	async ngOnInit(): Promise<void> {
		if(!this.entityType || !this.entityService)
			throw new Error('Cannot instantiate the controller without entityType.');
		this.controller = new ManageItemsControllerWrapper<typeof this.entityType>(this.entityService, null, this.r, this.cs, this.fb, this.utilsServ, this.aro, this.trans, 
																				this.entityName, this.labeledIdentifierField, this.entityLabeledTitle, this.labeledDialogTitle,
																				this.cols, this.lists, this.subsetKey, this.initFilters, this.paginatorSelectedDate,
																				this.dateFilteringPropertyKey, this.dynamicMappings)
		this.controller!.selectedItems = this.selectedItems;
		this.controller!.setSubsetKey(this.subsetKey);
		await this.controller!.ngOnInit();
	}

	selectionChange(items : FormGroup<any>[]){
		//filter jfor just selectable 
		this.selectedItems = items.map(item => item.getRawValue());
		//filter jfor just selectable 
		this.selectedItems = this.selectedItems.filter(item => this.selectablePredicate(item));
		this.selectedItemsChange.emit(this.selectedItems);
	}


	getDetailsRouterLink(item: T, route: DetailsRoute<T>) : string{
		let link = "./"+ this.entityName.toLowerCase();
		if(this.detailsRoutes)
			link += "/" + route.route + "/" + getFilterKey(getFilterFromDynamic(route.filter, item));
		else
		link += "/details"
		return link;
	}

	getPrevStepRouterLink() {
		throw new Error('Method not implemented.');
	}
	goToMainController() {
		throw new Error('Method not implemented.');
	}
	uploadFile(arg0: any, $event: any) {
		throw new Error('Method not implemented.');
	}
}
