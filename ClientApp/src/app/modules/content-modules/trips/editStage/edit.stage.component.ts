import { Component, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { TableItem } from 'src/app/modules/shared/components/nestedTable/models';
import { NestedTableComponent } from 'src/app/modules/shared/components/nestedTable/nested-table.component';
import { Constants } from 'src/app/modules/shared/Constants';
import { ManageItemsController } from 'src/app/modules/shared/generic/controllers/manage-items.controller';
import { DynamicPropertyFilter, EntityFilterOperator, PropertyFilter } from 'src/app/modules/shared/generic/filters/filtering/PropertyFilter';
import { DynamicMapping, DynamicMappingList } from 'src/app/modules/shared/generic/mapping/models';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { getFilterKey, getFilterValue } from 'src/app/modules/shared/generic/filters/filters.helper';
import { GetFilterFromRoute, GetFilterKeyFromRoute } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { DynamicValidator, LocalTableFilter, MaxDateValidator, MinDateValidator, TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { DriversService } from '../../drivers/drivers.service';
import { TracksService } from '../../tracks/tracks.service';
import { Package, PackageType } from '../../warehouse/models/package';
import { PackagesService } from '../../warehouse/packages.service';
import { Address, StageType, Trip, TripStage} from '../models/models';
import { StagesService } from '../stages.service';
import { TripsService } from '../trips.service';
import { TripsUtilsService } from '../trips.utils.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomersService } from '../../customers/customers.service';
import { PackagesUtilsService } from '../../warehouse/packages.utils.service';
import { Customer } from '../../customers/models/customer';

@Component({
	selector: 'edit-stage',
	templateUrl: './edit.stage.component.html',
	styleUrls: ['./edit.stage.component.scss']
})
export class EditStageComponent extends ManageItemsController<TripStage> {
	@ViewChild("nt", { static: false }) nt: NestedTableComponent<Trip, TripStage> | undefined = undefined
	
	entityName: string = "Stage";
	labeledDialogTitle: string = this.translate.instant("trips.entities");
	labeledIdentifierField: string = "code";
	labeledEntityName: string = "";
	parentTrip? : Trip = undefined

	cols: TableColumn[] = [
		{
			displayName: this.translate.instant("common.code"),
			columnId: "code",
			dataType: "none",
		},
		{
			displayName: this.translate.instant("common.date"),
			columnId: "date",
			dataType: "date",
			validators: [Validators.required],
			dynamicValidatorsFunction : (item: TripStage) : DynamicValidator[]  =>  {
				if(this.parentTrip){
					return [new MinDateValidator(this.parentTrip!.startDate), new MaxDateValidator(this.parentTrip.endDate)] //TODO: set correct date
				}
				else return []
			}
		},
		{ //selecting email will fill other fields
			displayName: this.translate.instant("trips.stages.type"),
			columnId: "type",
			dataType: "comboBox",
			immutableIfDefined: true,
			sourceListName: "stageTypes",
			mappedKey: "value",
			validators: [Validators.required]
		},
		{ //selecting email will fill other fields
			displayName: this.translate.instant('customer.email'),
			columnId: "customer",
			dataType: "customer",
			sourceListName: "customers",
			mappedKey: "email",
			validators: [Validators.required],
		},
		{
			displayName: this.translate.instant('common.address'),
			columnId: "address",
			dataType: "address",
			validators: [Validators.required],
			calculationFunction: (item: TripStage) => {
				let addressEmpty = this.utilsServ.isObjectEmpty(item);
				if(!addressEmpty){
					let address = item.address.streetName + ", " + item.address.streetNumber + ", " + item.address.city + ", " + item.address.postalCode 
					+ ", " + item.address.region + ", " + item.address.state
					return address;
				}
				else{
					return "";
				}
			}
			
		},
		{ 
			displayName: this.translate.instant("packages.entities"),
			columnId: "packages",
			dataType: "none",
			calculationFunction: (item: TripStage, lists: {[key: string]: BehaviorSubject<any[] | null | undefined>}) => {
				if (item.type == StageType.withdraw)
					return lists["packages"].value?.filter(e => e.inboundStageUid === item.uid).length;
				else
					return lists["packages"].value?.filter(e => e.outboundStageUid === item.uid).length;
			},
			calculatedRouterLink: (item: TripStage) => {
				if (item) {
					if (item.type == StageType.withdraw)
						return "../../../../warehouse/filter/inboundStageUid/" + item.uid;
					else
						return "../../../../warehouse/filter/outboundStageUid/" + item.uid;
				}
				return 0;
			}
		}
	]	
	//--------- withdraw stage association properties
	tripCols: TableColumn[] = [
		{
			displayName: this.translate.instant("common.code"),
			columnId: "code",
		},
		{
			displayName: this.translate.instant("trips.startDate"),
			columnId: "startDate",
			dataType: "date"
		},
		{
			displayName: this.translate.instant("trips.endDate"),
			columnId: "endDate",
			dataType: "date"
		},
		{
			displayName: this.translate.instant("trips.km"),
			columnId: "km",
		},
		{
			displayName: this.translate.instant("trips.duration"),
			columnId: "_labeledDuration",
			calculationFunction : (item: Trip) => {
				return "2 days" //TODO: implement
			}
		},
		{
			displayName: this.translate.instant("drivers.entity"),
			columnId: "driver",
			sourceListName: "drivers",
			mappedKey: "_compositeName"
		},
		{
			displayName: this.translate.instant("trucks.entity"),
			columnId: "track",
			sourceListName: "tracks",
			mappedKey: "code"
		},
	]
	showWithdrawStageAssociationWizard = false
	deliveryStageAssociationSelectedStage: TripStage | null = null
	waitingWizardAssociationResult = false;
	parentEntityName = "Trip"
	parentLabeledEntityName : string = this.translate.instant("trips.entities");
	parentLabeledDialogTitle: string = this.translate.instant("trips.entity"); 
	selectedWithdrawStages : TripStage[] = []
	intitallySelectedWithdrawStages : TripStage[] = []
	enableWithdrawStagesWizardButton = false;

	isStageSelectableForAssociation : (item: TripStage) => boolean = (item : TripStage) => {
		return item.type == StageType.withdraw && (item._calculatedValue_packages ?? 0) > 0;
	}
	getNestedItemDynamicLists() : {[key:string]: DynamicMappingList<Trip>} {
		let map : {[key:string]: DynamicMappingList<Trip>}  = {}
		let filter : [DynamicPropertyFilter<Trip,string>,EntityFilterOperator | null][] | DynamicPropertyFilter<Trip,string> = [
			[new DynamicPropertyFilter<Trip,string>("inboundTripUid", "uid"),
			EntityFilterOperator.OR],
			[new DynamicPropertyFilter<Trip,string>("outboundTripUid", "uid"),
			null]
		] 
		map["packages"] = new DynamicMappingList<Trip>(this.pServ,filter);
		return map;
	}
	nestedItem = {
		cols: this.cols,
		entityName: this.entityName,
		labeledEntityName: this.labeledEntityName,
		labeledDialogTitle: this.labeledDialogTitle,
		children: null,
		entityService: this.service,
		dialogService: this.dialog,
		labeledIdentifierField: "code",
		entityType: {} as TripStage,
		showDatesPaginator: false,
		initFilters: [{
			columnId: "type",
			value: StageType.withdraw
		} as LocalTableFilter,
			//{columnId: "packages", value: 0, matchCriteria: FilterMatchMode.GREATER_THAN} as InitFilter
		],
		
	}
	rootTableItem = {
		cols: this.tripCols,
		entityName: this.parentEntityName,
		labeledEntityName: this.parentLabeledEntityName,
		labeledDialogTitle: this.parentLabeledDialogTitle,
		children: this.nestedItem,
		entityService: this.tripService,
		dialogService: this.tripDialog,
		labeledIdentifierField: "uid",
		entityType: {} as Trip,
		initFilters: [],
		subsetKey : getFilterKey(this.tripsUtilsServ.getTripsCurrentMonthFilter()),
		childPropertyFilter: new DynamicPropertyFilter<Trip,string>("trip", "uid"),
		mappingLists: this.lists,
		childDynamicMappingLists: this.getNestedItemDynamicLists(),
		showDatesPaginator: true,
		dateFilteringPropertyKey: "startDate"
	} as TableItem<Trip, TripStage>

	//package association properties
	packageSelectionWizardOpened = false;
	packagesWizardSelectedStage: TripStage | null = null
	waitingPackageSelectionResult = false;
	selectedPackages: Package[] = [];
	initiallySelectedPackages : Package [] = [];
 	isPackageSelectable : (item: Package) => boolean = (item : Package) => {
		if(this.packagesWizardSelectedStage?.type == StageType.withdraw){
			if((!item.inboundTripUid && !item.inboundStageUid) || item.inboundStageUid == this.packagesWizardSelectedStage.uid)
				return true;
		}
		if(this.packagesWizardSelectedStage?.type == StageType.delivery){
			if((!item.outboundTripUid && !item.outboundStageUid )|| item.outboundStageUid == this.packagesWizardSelectedStage.uid)
				return true;
		}
		return false;
	}
	packageEntity = {} as Package;
	packageEntityName = "Package";
	packageEntityTitle: string = this.translate.instant("packages.entities");
	packageDialogTitle: string = this.translate.instant("packages.entity")
	packageSelectionSubsetKey = "";
	packagesCols : TableColumn[] = this.packagesUtils.cols;
	packagesDynamicMappings = [ 
		new DynamicMapping<TripStage>(this.service,'stages',["inboundStageUid", "outboundStageUid" ]),
		new DynamicMapping<Trip>(this.tripService,'trips',["inboundTripUid", "outboundTripUid" ])
	]
	packageSelectionLists : {[key: string] : BehaviorSubject<null | undefined | any[]>} = {}
	//stages wizard properties


	constructor(
		protected tripService: TripsService,
		protected tripDialog: DialogService<Trip>,
		protected service: StagesService,
		protected dialog: DialogService<TripStage>,
		protected confs1: ConfirmationService,
		protected r1: Router,
		protected ar: ActivatedRoute,
		protected formb: FormBuilder,
		protected utilsServ: UtilsService,
		public pServ: PackagesService,
		public drivServ: DriversService,
		public trackServ: TracksService,
		public constants: Constants,
		public tripsUtilsServ : TripsUtilsService,
		private translate: TranslateService,
		protected pkgDlg: DialogService<Package>,
		private packagesUtils : PackagesUtilsService,
		private customersServ : CustomersService,
	
	) {
		super(service, confs1, r1, formb, utilsServ, ar, translate);
		//get by syncResolver since we need these lists for the nested table.
		this.lists["drivers"] = this.drivServ.items[constants.allItemsSetKey]
		this.lists["tracks"] = this.trackServ.items[constants.allItemsSetKey]
		this.lists["customers"] = this.customersServ.items[constants.allItemsSetKey]
		this.packageSelectionLists["packageTypes"] = new BehaviorSubject<any[] | null | undefined>(this.utilsServ.enumToObjects(PackageType).map(e => ({...e, value :  this.translate.instant("packages.types."+ (e.value as string).toLowerCase())})));
	}


	override async ngOnInit(): Promise<void> {
		let filterKey = GetFilterKeyFromRoute(this.entityService.getFakeEntityObject(),this.ar.snapshot)
		this.setSubsetKey(filterKey);
		let currentTripAssociatedPkgsFKey = GetFilterKeyFromRoute(this.pServ.getFakeEntityObject(),this.ar.snapshot)
		this.lists["packages"] = this.pServ.items[currentTripAssociatedPkgsFKey];
		this.lists["stageTypes"] = new BehaviorSubject<any[] | null | undefined>(this.utilsServ.enumToObjects(StageType).map(e => ({...e, value :  this.translate.instant("trips.stages."+ (e.value as string).toLowerCase())})));
		this.parentTrip = await this.tripService.getItem({uid: this.getParentTripUid()} as Trip);
		await super.ngOnInit();
	}

	uploadFile(item: TripStage, event: any) {
		item.documents = event.files.map((f: File) => f.name)
		//this.service.uploadDocument(item, event.files);
	}

	async openWithdrawStageAssociationWizard(item: TripStage) {
		//da un tripstage di delivery viene chiamata questa funzione
		//prendere tutti gli id degli stage di ritiro associati ai pacchetti che hanno come stage di consegna quello selezionato
		var selectedPackages = (this.lists["packages"].value?.filter(e => e.outboundStageUid === item.uid) ?? []) as Package[];
		var withdrawUids = Object.entries(this.u.groupByKey(selectedPackages.filter(p => p.inboundTripUid && p.inboundStageUid).map(p => ({ "trip": p.inboundTripUid! , "stage": p.inboundStageUid!})), "trip"));

		for(var uidsCouple of withdrawUids){
			var observable = this.entityService.items[uidsCouple[0]]
			let stagesForCurrentTrip : TripStage[];
			if(observable){
				stagesForCurrentTrip = observable.value?.filter(stage => uidsCouple[1].map(couple => couple.stage).includes(stage.uid)) ?? []
			}
			else{
				let filter = new PropertyFilter("trip", uidsCouple[0]);
				let key = getFilterKey(filter);
				await this.entityService.getFilteredItems(null,filter);
				stagesForCurrentTrip = this.entityService.items[key].value?.filter(stage => uidsCouple[1].map(couple => couple.stage).includes(stage.uid)) ?? []
			}
			this.selectedWithdrawStages = this.selectedWithdrawStages.concat(stagesForCurrentTrip)
		}
		
		this.deliveryStageAssociationSelectedStage = item;
		this.intitallySelectedWithdrawStages = [...this.selectedWithdrawStages]; //copy the value, not the ref.
		this.showWithdrawStageAssociationWizard = true;
	}

	openImportDttWizard(item: TripStage) {
		console.log("import dtt wizard")
	}

	async openPackagesSelectionWizard(item: TripStage) {	
		this.selectedPackages = this.lists["packages"].value?.filter(e => e.inboundStageUid === item.uid || e.outboundStageUid == item.uid) ?? [] as Package[];
		let filter = this.tripsUtilsServ.getFilterForTripStagePackagesWizard(item);
		this.pServ.getFilteredItems(null,filter).then(r => {}); //get packages since we do not use routing to open component.
		this.packageSelectionSubsetKey = getFilterKey(filter);
		this.initiallySelectedPackages = [...this.selectedPackages];
		this.packagesWizardSelectedStage = item;
		this.packageSelectionWizardOpened = true;
	}

	closePackageSelectionWizard() {
		this.waitingPackageSelectionResult = false;
		this.packageSelectionWizardOpened = false;
		this.packagesWizardSelectedStage = null;
		this.selectedPackages = [];
		this.initiallySelectedPackages = [];
		
	}
	
	async packageSelectionWizardConfirmed(){
		//TODO: FIX: component is returning every time all the selected packages. not good. 
		if(!this.packagesWizardSelectedStage)
			return;
		this.waitingPackageSelectionResult = true;
		var selectedPackagesUids = new Set(this.selectedPackages.map(i => i.uid));
		var union = (new Set([...selectedPackagesUids,...this.initiallySelectedPackages.map(s => s.uid)]))
		for(var id of selectedPackagesUids)
			union.delete(id);
		var deselectedPackagesUids = union;

		//N.B we prefer to download all data with a single query cause packages table already did it with the same filter. They are already in table.
		var updatedPackages = (await this.pServ.getFilteredItems(null, this.tripsUtilsServ.getFilterForTripStagePackagesWizard(this.packagesWizardSelectedStage)) ?? []).map(p => {
			if(selectedPackagesUids.has(p.uid)){
				if(this.packagesWizardSelectedStage?.type == StageType.delivery){
					p.outboundStageUid = this.packagesWizardSelectedStage.uid;
					p.outboundTripUid = this.packagesWizardSelectedStage.trip;
				}
				else if(this.packagesWizardSelectedStage?.type == StageType.withdraw){
					p.inboundStageUid = this.packagesWizardSelectedStage.uid;
					p.inboundTripUid = this.packagesWizardSelectedStage?.trip;
				}
			}

			if(deselectedPackagesUids.has(p.uid)){
				if(this.packagesWizardSelectedStage?.type == StageType.delivery){
					p.outboundStageUid = null;
					p.outboundTripUid = null;
				}
				else if(this.packagesWizardSelectedStage?.type == StageType.withdraw){
					p.inboundStageUid = null;
					p.inboundTripUid = null;
				}
			}

			return p;
		})

		if(updatedPackages){
			await this.pServ.editItems(updatedPackages);
		}

		this.closePackageSelectionWizard();
	}

	selectedWithdrawStagesChange(items: TripStage[]){
		this.enableWithdrawStagesWizardButton = true;
	}

	withdrawStageAssociationWizardClosed(){
		this.waitingWizardAssociationResult = false;
		this.deliveryStageAssociationSelectedStage = null;
		this.showWithdrawStageAssociationWizard = false;
		this.selectedWithdrawStages = [];
		this.intitallySelectedWithdrawStages = [];
		this.enableWithdrawStagesWizardButton = false;
	}

	async withdrawStageAssociationWizardConfirmed() {
		if (!this.deliveryStageAssociationSelectedStage) //called multiple times cause also the dialog will call it as event.
			return;
		this.waitingWizardAssociationResult = true;
		//calculate the difference
		let selectedWStages = new Set(this.selectedWithdrawStages);
		let union = (new Set([...selectedWStages,...this.intitallySelectedWithdrawStages]))
		for(var wStage of selectedWStages)
			union.delete(wStage);
		let deselectedWStages = union;
		let packagesToUpdate : Package[] = [];

		//N.B We prefer to download data separately cause nested table already did it. so they are in cache with these filters.

		//foreach sui selected (sono già in cache perchè dalla nested table per selezionarli li ho scaricati)
		for(var selectedWithdraw of selectedWStages){
			let filter = new PropertyFilter("inboundTripUid", selectedWithdraw.trip);
			let packages = (await this.pServ.getFilteredItems(null,filter) ?? []).map(p => {	
				p.outboundStageUid = this.deliveryStageAssociationSelectedStage!.uid;
				p.outboundTripUid = this.deliveryStageAssociationSelectedStage!.trip;
				return p;
			})
			packagesToUpdate = packagesToUpdate.concat(packages);
		}
		//foreach sui deselected (sono già in cache perchè dalla nested table per selezionarli li ho scaricati)
		for(var deselectedWithdraw of deselectedWStages){
			let filter = new PropertyFilter("inboundTripUid", deselectedWithdraw.trip);
			let packages = (await this.pServ.getFilteredItems(null,filter) ?? []).map(p => {	
				p.outboundStageUid = null;
				p.outboundTripUid = null
				return p;
			})
			packagesToUpdate = packagesToUpdate.concat(packages);
		}

		if (packagesToUpdate)
			await this.pServ.editItems(packagesToUpdate)

		this.withdrawStageAssociationWizardClosed();
	}

	getNextStepRouterLink(){
		return GetFilterKeyFromRoute(this.entityService.getFakeEntityObject(),this.ar.snapshot);
	}

	getParentTripUid(): string{
		let filter = GetFilterFromRoute(this.entityService.getFakeEntityObject(),this.ar.snapshot);
		if(filter){
			let tripUid = getFilterValue("trip", filter)
			if(!tripUid) {
				throw new Error("Cannot extract trip uid from routing filter key.");
			}
			return tripUid;
		}
		throw new Error("Cannot extract trip uid from routing filter key.");
	}

	customerCreated(item: Customer, form: FormGroup){
		form.controls["customer"].setValue(item.uid);
		form.controls["customer"].markAsTouched();
	}

	async onCustomerSelectionChanges(item: FormGroup) {
		let customerUid = item.controls["customer"].value as string;
		if(customerUid){
			await this.setAddress(item);
		}
	}

	async setAddress(item: FormGroup){
		let customerUid = item.controls["customer"].value as string;
		var customerAddress = (await this.customersServ.getItem({uid: customerUid } as Customer))?.address;
		item.controls["address"].setValue(customerAddress);
	}

	override async onRowEditSave(formGroup: FormGroup<any>): Promise<void> {
		this.waitingResult = true;
		await this.saveAddressOfNewCustomer(formGroup);
		super.onRowEditSave(formGroup);
	}

	async saveAddressOfNewCustomer(item: FormGroup){
		let customerUid = item.controls["customer"].value as string;
		let customer =  await this.customersServ.getItem({uid: customerUid } as Customer)
		let addressIsEmpty = this.utilsServ.isObjectEmpty(customer?.address)
		if(addressIsEmpty){
			let newAddress = item.controls["address"].getRawValue() as Address;
			await this.customersServ.editItem({...customer , address: newAddress} as Customer);
		}
	}

}

