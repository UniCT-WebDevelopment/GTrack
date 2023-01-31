import { Component } from '@angular/core'
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { ListItemsController } from 'src/app/modules/shared/generic/controllers/list-items.controller';
import { getAbsolutePathFromRelative } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { allItemsSetKey } from 'src/app/modules/shared/GlobalConstants';
import { DetailsRoute, TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { PaymentType } from '../../trips/models/models';
import { Track, TruckType } from '../models/track';
import { TracksService } from '../tracks.service';
import { TracksUtilsService } from '../tracks.utils.service';

@Component({
	selector: 'manage-tracks',
	templateUrl: './manage.tracks.component.html',
	styleUrls: ['./manage.tracks.component.scss']
})
export class ManageTracksComponent{	
	labeledIdentifierField: string = "licensePlate";
	entityName: string = "Track";
	entityType: Track = {} as Track;
	labeledTitle: string = this.translate.instant("trucks.entity")
	labeledDialogTitle: string = this.translate.instant("common.editItem", {entity:this.labeledTitle});
	labeledEntityName: string = this.translate.instant("trucks.entities");

	lists : {[key:string]: BehaviorSubject<any[] | null | undefined>} = {};
	cols: TableColumn[] = [ 
		{
			displayName: this.translate.instant("trucks.type") ,
		 	columnId: "type",
			sourceListName: "truckTypes",
			mappedKey: "value",
		},
		{
			displayName: this.translate.instant("trucks.manufacturer") ,
		 	columnId: "manufacturer", 
		},
		{
			displayName: this.translate.instant("trucks.model") ,
		 	columnId: "model", 
		},
		{
			displayName: this.translate.instant("trucks.plate") ,
		 	columnId: "licensePlate", 
			
		},
		{
			displayName: this.translate.instant("trucks.activekm") ,
		 	columnId: "km", 
		},
		{
			displayName: this.translate.instant("trucks.policy"),
			columnId: "expirations",
			dataType: "expiration",
			calculationFunction : (item: Track) =>  {
				if(!this.u.isObjectEmpty(item.expiration)){
					let expirationData = this.u.getLabeledDate(item.expiration.effectiveDate)  + ", ";
					if(item.expiration.paymentMethod == "Cash"){
						expirationData += this.translate.instant("paymentType.cash") + ", ";
					}
					else{
						expirationData += this.translate.instant("paymentType.card") + ", ";
					} 
					expirationData += item.expiration.cost + " €";
					return expirationData;
				}
				return "";
			},	
		},
		{
			displayName: this.translate.instant("trucks.taxExpiration"),
			columnId: "vehicleTax",
			dataType:"date",
		},
		{
			displayName: this.translate.instant("trucks.inspection"),
			columnId: "inspection",
			dataType: "date"
		}
		]

	editCols: TableColumn[] = [ 
		{
			displayName: this.translate.instant("trucks.type") ,
		 	columnId: "type",
			sourceListName: "truckTypes",
			dataType: "comboBox",
			mappedKey: "value",
			immutableIfDefined: true,
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("trucks.plate") ,
		 	columnId: "licensePlate",
			validators: [Validators.required, Validators.pattern('^[ABCDEFGHJKLMNPRSTVWXYZ]{2}[0-9]{3}[ABCDEFGHJKLMNPRSTVWXYZ]{2}$')] 
		},
		{
			displayName: this.translate.instant("trucks.manufacturer") ,
		 	columnId: "manufacturer",
			validators: [Validators.required] 
		},
		{
			displayName: this.translate.instant("trucks.model") ,
		 	columnId: "model",
			validators: [Validators.required] 
		},
		{
			displayName: this.translate.instant("trucks.activekm") ,
		 	columnId: "km",
			dataType: "number",
			measureUnit: "km"
		},
		{
			displayName: this.translate.instant("trucks.policy"),
			columnId: "expiration",
			dataType: "expiration"
		},
		{
			displayName: this.translate.instant("trucks.taxExpiration"),
			columnId: "vehicleTax",
			dataType:"date",
		},
		{
			displayName: this.translate.instant("trucks.inspection"),
			columnId: "inspection",
			dataType: "date"
		}
		]

		detailsRoutes  : DetailsRoute<Track>[] = [
			{route: "details" , filter: this.trkUtilsServ.getTripsOfTrucks()} as DetailsRoute<Track>,
			{route: "maintenance", filter: this.trkUtilsServ.getMaintenanceOfTruck(), icon: "pi pi-wrench"} as DetailsRoute<Track>
			// {route:"policies"} as DetailsRoute<Track>
		]
	
		showDetailDialog = false;

	constructor(
		public es : TracksService,
		public ds : DialogService<Track>,
		private cs : ConfirmationService,
		public r: Router,
		public u: UtilsService,
		protected arou: ActivatedRoute,
		private translate: TranslateService,
		private dds: DetailsDialogService<Track>,
		private trkUtilsServ: TracksUtilsService,
	) {
		this.lists["truckTypes"] = new BehaviorSubject<any[] | null | undefined>(this.u.enumToObjects(TruckType).map(e => ({...e, value :  this.translate.instant("trucks.types."+ (e.value as string).toLowerCase())})));
	}

	ngOnInit(): void {
		console.log(window.location.origin)
		this.dds.showDialog.subscribe(v => this.showDetailDialog = v ?? false);
	}

	dismissDetailsDialog(){
		let manageControllerUrl = getAbsolutePathFromRelative(this.r.url, "../../../");
		this.r.navigateByUrl(manageControllerUrl);
	}


}
