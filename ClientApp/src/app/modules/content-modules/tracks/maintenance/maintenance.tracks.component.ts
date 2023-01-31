import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { TripsService } from '../../trips/trips.service';
import { StagesService } from '../../trips/stages.service';
import { TranslateService } from '@ngx-translate/core';
import { GetFilterKeyFromRoute } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { Buyer, CostType, PaymentType, Trip } from '../../trips/models/models';
import { getFilterFromKey, getFilterKey, getFilterValue } from 'src/app/modules/shared/generic/filters/filters.helper';
import { allItemsSetKey } from 'src/app/modules/shared/GlobalConstants';
import { DriversService } from '../../drivers/drivers.service';
import { BehaviorSubject, throwError } from 'rxjs';
import { CostsService } from '../../trips/costs.service';
import { MaintenanceCost } from '../models/maintenanceCost';
import { MaintenancesService } from '../maintenances.service';
import { Validators } from '@angular/forms';


@Component({
	selector: 'maintenance',
	templateUrl: './maintenance.tracks.component.html',
	styleUrls: ['./maintenance.tracks.component.scss']
})
export class MaintenanceTracksComponent implements OnInit {
	labeledIdentifierField: string = "uid";
	entityType = {} as MaintenanceCost;
	entityName: string = "";
	subsetKey : string;
	entityLabeledTitle: string = this.translate.instant("trucks.maintenance.dialog");

	cols: TableColumn[] = [
		{
			displayName: this.translate.instant("common.code"),
			columnId: "code",
			dataType: "none",
		},
		{ //selecting email will fill other fields
			displayName: this.translate.instant("common.date") ,
		 	columnId: "date", 
			dataType: "date",
			validators: [Validators.required]
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
			displayName: this.translate.instant("trips.entity") ,
		 	columnId: "trip", 
			dataType: "none"
		},
	]

	lists: {[key:string]: BehaviorSubject<any[]| null | undefined>} = {}


	constructor(
		private cs: ConfirmationService,
		public r: Router,
		public utilsServ: UtilsService,
		public ar: ActivatedRoute,
		public translate: TranslateService, 
		public es: MaintenancesService
	) {

		this.subsetKey = GetFilterKeyFromRoute(this.es.getFakeEntityObject(),this.ar.snapshot);	
		this.lists["costTypes"] = new BehaviorSubject<any[] | null | undefined>(this.utilsServ.enumToObjects(CostType).map(e => ({...e, value :  this.translate.instant("costs."+ (e.value as string).toLowerCase())})));
		this.lists["buyers"] = new BehaviorSubject<any[] | null | undefined>(this.utilsServ.enumToObjects(Buyer).map(e => ({...e, value :  this.translate.instant("buyers."+ (e.value as string).toLowerCase())})));
		this.lists["paymentTypes"] = new BehaviorSubject<any[] | null | undefined>(this.utilsServ.enumToObjects(PaymentType).map(e => ({...e, value :  this.translate.instant("paymentType."+ (e.value as string).toLowerCase())})));
	}


	ngOnInit(): void {
		let filter = getFilterFromKey(this.subsetKey);
		//console.log(this.subsetKey)
		//console.log(filter);
	}



}
