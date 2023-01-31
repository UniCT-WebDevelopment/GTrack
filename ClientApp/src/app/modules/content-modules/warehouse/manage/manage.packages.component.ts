import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { TripsService } from '../../trips/trips.service';
import { Measures, Package, PackageType } from '../models/package';
import { PackagesService } from '../packages.service';
import { BehaviorSubject } from 'rxjs';
import { allItemsSetKey } from 'src/app/modules/shared/GlobalConstants';
import { Validators } from '@angular/forms';
import { getFilterKey, getPaginationKey } from 'src/app/modules/shared/generic/filters/filters.helper';
import { TranslateService } from '@ngx-translate/core';
import { PackagesUtilsService } from '../packages.utils.service';
import { TruckType } from '../../tracks/models/track';
import { DynamicMapping } from 'src/app/modules/shared/generic/mapping/models';
import { StagesService } from '../../trips/stages.service';
import { TripStage, Trip } from '../../trips/models/models';


@Component({
	selector: 'manage-packages',
	templateUrl: './manage.packages.component.html',
	styleUrls: ['./manage.packages.component.scss']
})
export class ManagePackagesComponent{

	allowEdit = true;
	allowDelete = true;
	allowCreate = true;
	showTitle = true;
	showSearchBar = true;
	showPaginator = true;
	showSelection = false;

	@Input() selectedItems : Package[] = []
	@Output() selectedItemsChange  = new EventEmitter<Package[]>();
	@Input() selectablePredicate : (item: Package) => boolean = () => true;

	labeledIdentifierField: string = "code";
	entityName: string = "Package";
	entityTitle: string = this.translate.instant("packages.entities");
	dialogTitle: string = this.translate.instant("packages.entity")
	entityType = {} as Package
	subsetKey = allItemsSetKey;
	dateFilteringPropertyKey = "creationDate";
	
	cols: TableColumn[] = this.packagesServUtils.cols;

	dynamicMappings = [ 
		new DynamicMapping<TripStage>(this.stagesService,'stages',["inboundStageUid", "outboundStageUid" ]),
		new DynamicMapping<Trip>(this.tripsService,'trips',["inboundTripUid", "outboundTripUid" ])
	]

	editComponentColumns: TableColumn[] = [
		{
			displayName: this.translate.instant("common.code"),
			columnId: "code",
			dataType: "text",
			immutableIfDefined: true,
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("packages.type"),
			columnId: "type",
			validators: [Validators.required],
			sourceListName: "packageTypes",
			mappedKey: "value",
			dataType: "comboBox"
		},
		{
			displayName: this.translate.instant("common.measures"),
			columnId: "measures",
			validators: [Validators.required],
			dataType: "genericPicker",
			nestedCols: this.packagesServUtils.measuresCols,
			propertyAggregationFunction : (item: Measures) => {
				if(!this.utilsServ.isObjectEmpty(item)){
					var length : string = item.length ? item.length.toString() : "0";
					var height : string = item.height ? item.height.toString() : "0";
					var width : string = item.width? item.width.toString() : "0";
					var weight : string = item.weight? item.weight.toString() : "0";
					var measures : string = length + " x " + height + " x " + width + " cm; " + weight + " kg";
					return measures;
				}
				else return ""
			}
		},
		{
			displayName: this.translate.instant("common.estimatedDestinationArea"),
			columnId: "estimatedDestinationArea",
			validators: [Validators.required],
			dataType: "upctext"
		},
		{
			displayName: this.translate.instant("common.estimatedDestinationAddress"),
			columnId: "estimatedDestinationAddress",
			validators: [Validators.required],
			dataType: "address"
		},
		{
			displayName: this.translate.instant("common.description"),
			columnId: "description",
			validators: [Validators.required],
			dataType: "text"
		},
	]

	lists: {[key:string]: BehaviorSubject<any[]| null | undefined>} = {}


	constructor(
		public es: PackagesService,
		public ds: DialogService<Package>,
		private cs: ConfirmationService,
		public r: Router,
		public utilsServ: UtilsService,
		public stagesService: StagesService,
		public tripsService: TripsService,
		public ar: ActivatedRoute,
		private translate: TranslateService,
		private packagesServUtils: PackagesUtilsService
	) {
		this.subsetKey = getFilterKey(this.packagesServUtils.getPackagesCurrentMonthFilter());
	}

	ngOnInit() {
		this.lists["packageTypes"] = new BehaviorSubject<any[] | null | undefined>(this.utilsServ.enumToObjects(PackageType).map(e => ({...e, value :  this.translate.instant("packages.types."+ (e.value as string).toLowerCase())})));
	}

	selectChange(items: Package[]){
		this.selectedItems = items;
		this.selectedItemsChange.emit(items);
	}
}
