import { Component} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { ManageItemsController } from 'src/app/modules/shared/generic/controllers/manage-items.controller';
import { getFilterKey, getFilterValue } from 'src/app/modules/shared/generic/filters/filters.helper';
import { PropertyFilter, EntityFilterOperator } from 'src/app/modules/shared/generic/filters/filtering/PropertyFilter';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { getAbsolutePathFromRelative, GetFilterFromRoute, GetFilterKeyFromRoute } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { DynamicValidator, MaxDateValidator, MinDateValidator, ReadonlyValidator, TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { CostsService } from '../costs.service';
import { Buyer, Cost, CostType, PaymentType, Trip, TripStage } from '../models/models';
import { TripsUtilsService } from '../trips.utils.service';
import { TranslateService } from '@ngx-translate/core';
import { TripsService } from '../trips.service';

@Component({
	selector: 'edit-cost',
	templateUrl: './edit.cost.component.html',
	styleUrls: ['./edit.cost.component.scss']
})
export class EditCostComponent extends ManageItemsController<Cost> {
	entityName: string = "Cost";
	labeledDialogTitle: string = ""; //TO-DO TRANSLATION
	labeledIdentifierField: string = "uid";
	labeledEntityName: string = "";
	parentTrip? : Trip = undefined

	cols: TableColumn[] = [ 
		{
			displayName: this.translate.instant("common.code") ,
		 	columnId: "code", 
			dataType: "none"
		},
		{
			displayName: this.translate.instant("common.type"),
		 	columnId: "type",
			dataType: "comboBox",
			sourceListName : "costTypes",
			mappedKey: "value",
			validators: [Validators.required],
			immutableIfDefined: true
		},
		{ //selecting email will fill other fields
			displayName: this.translate.instant("common.date") ,
		 	columnId: "date", 
			dataType: "date",
			validators: [Validators.required],
			dynamicValidatorsFunction : (item: Cost) : DynamicValidator[]  =>  {
				if(this.parentTrip){
					return [new MinDateValidator(this.parentTrip!.startDate), new MaxDateValidator(this.parentTrip.endDate)] //TODO: set correct date
				}
				else return []
			}
		},
		{
			displayName: this.translate.instant("common.price") ,
		 	columnId: "price", 
			dataType: "currency",
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("trips.costs.paidBy") ,
		 	columnId: "payedBy", 
			dataType: "comboBox",
			sourceListName: "buyers",
			mappedKey: "value",
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("trips.costs.paymentMethod") ,
		 	columnId: "paymentDetails", 
			dataType: "comboBox",
			sourceListName: "paymentTypes",
			mappedKey: "value",
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("trips.costs.gasStation"),
		 	columnId: "fuelStation",
			dataType: "text",
			dynamicValidatorsFunction : (item: Cost) : DynamicValidator[]  =>  {
				if(item){
					if(item.type != CostType.Fuel)
						return [new ReadonlyValidator(true)]
					else return [new ReadonlyValidator(false)]
				}
				else return []
			}
		},
		{
			displayName: this.translate.instant("common.liters"),
		 	columnId: "liters",
			dataType: "number",
			measureUnit: "Lt",
			dynamicValidatorsFunction : (item: Cost) : DynamicValidator[]  =>  {
				if(item){
					if(item.type != CostType.Fuel)
						return [new ReadonlyValidator(true)]
					else return [new ReadonlyValidator(false)]
				}
				else return []
			}
		},
		{
			displayName: this.translate.instant("trips.startLocation"),
		 	columnId: "startLocation",
			dataType: "text",
			dynamicValidatorsFunction : (item: Cost) : DynamicValidator[]  =>  {
				if(item){
					if(item.type != CostType.Cross && item.type != CostType.Telepass)
						return [new ReadonlyValidator(true)]
					else return [new ReadonlyValidator(false)]
				}
				else return []
			}
		
		},
		{
			displayName: this.translate.instant("trips.destination"),
		 	columnId: "destination",
			dataType: "text",
			dynamicValidatorsFunction : (item: Cost) : DynamicValidator[]  =>  {
				if(item){
					if(item.type != CostType.Cross && item.type != CostType.Telepass)
						return [new ReadonlyValidator(true)]
					else return [new ReadonlyValidator(false)]
				}
				else return []
			}
	
		}
	]

	constructor(
		protected service : CostsService,
		protected confs1: ConfirmationService,
		protected r1: Router,
		protected ar: ActivatedRoute,
		protected formb: FormBuilder,
		public utilsServ : UtilsService,
		public dServ : DialogService<Trip>,
		private tripUtils: TripsUtilsService,
		private translate: TranslateService,
		private tripService: TripsService
	) {
		super(service,confs1, r1, formb, utilsServ, ar, translate);
	}


	uploadFile(item: Cost, event: any){
		//this.service.uploadDocument(item, event.files);
	}

	override async ngOnInit(): Promise<void> {
		let filterKey = GetFilterKeyFromRoute(this.entityService.getFakeEntityObject(),this.ar.snapshot)
		this.setSubsetKey(filterKey);
		this.lists["costTypes"] = new BehaviorSubject<any[] | null | undefined>(this.utilsServ.enumToObjects(CostType).map(e => ({...e, value :  this.translate.instant("costs."+ (e.value as string).toLowerCase())})));
		this.lists["buyers"] = new BehaviorSubject<any[] | null | undefined>(this.utilsServ.enumToObjects(Buyer).map(e => ({...e, value :  this.translate.instant("buyers."+ (e.value as string).toLowerCase())})));
		this.lists["paymentTypes"] = new BehaviorSubject<any[] | null | undefined>(this.utilsServ.enumToObjects(PaymentType).map(e => ({...e, value :  this.translate.instant("paymentType."+ (e.value as string).toLowerCase())})));
		this.parentTrip = await this.tripService.getItem({uid: this.getParentTripUid()} as Trip);
		await super.ngOnInit();
	}

	getPrevStepRouterLink(){
		let filter = GetFilterFromRoute(this.entityService.getFakeEntityObject(), this.ar.snapshot)
		if(!filter)
			throw new Error("Cannot extract filter from route");
		let tripUid = getFilterValue("trip",filter);
		if(!tripUid)
		throw new Error("Cannot get trip uid from routing filter")
		let newFilter  = this.tripUtils.getFilterForTripStages(tripUid);
		return getFilterKey(newFilter)
	}

	goToMainController(){
		var baseUrl = getAbsolutePathFromRelative(this.r1.url,"../../../");
		this.dServ.showDialog.next(false);
		this.r1.navigateByUrl(baseUrl);
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

}
