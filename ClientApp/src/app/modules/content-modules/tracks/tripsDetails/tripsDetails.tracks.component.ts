import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { TripsService } from '../../trips/trips.service';
import { StagesService } from '../../trips/stages.service';
import { TranslateService } from '@ngx-translate/core';
import { GetFilterKeyFromRoute } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { Trip } from '../../trips/models/models';
import { getFilterFromKey, getFilterKey } from 'src/app/modules/shared/generic/filters/filters.helper';
import { allItemsSetKey } from 'src/app/modules/shared/GlobalConstants';
import { DriversService } from '../../drivers/drivers.service';
import { BehaviorSubject } from 'rxjs';

//trip code(inbound/outbound), stage(inbound/outbound), data, numero pacchetti

@Component({
	selector: 'trips-details',
	templateUrl: './tripsDetails.tracks.component.html',
	styleUrls: ['./tripsDetails.tracks.component.scss']
})
export class TripsDetailsTracksComponent implements OnInit {
	labeledIdentifierField: string = "uid";
	entityType = {} as Trip;
	entityName: string = "";
	entityLabeledTitle: string = this.translate.instant("trucks.tripsDialog");
	subsetKey : string;

	cols: TableColumn[] = [
		{
			displayName: this.translate.instant("common.code"),
			columnId:"code",
			calculatedRouterLink: (item: Trip) => {
				return "/admin/trips/trip/edit/" + item.uid;
			}
		},
		{
			displayName: this.translate.instant("trips.startDate"),
			columnId: "startDate",
		},
		{
			displayName: this.translate.instant("trips.endDate"),
			columnId: "endDate",
		},
		{
			displayName: this.translate.instant("trips.duration") ,
		 	columnId: "durationHours",
			calculationFunction: (item: Trip) => {
				var startDate = item.startDate;
    			var endDate = item.endDate;
				var differenceInTime = endDate.getTime() - startDate.getTime();
				var differenceInHours = differenceInTime / (1000 * 3600);
				return differenceInHours + " ore";
			}
		},
		{
			displayName: this.translate.instant("drivers.entity") ,
		 	columnId: "driver", 
			sourceListName: "drivers",
			mappedKey: "surname",
			
		}
		
	]

	lists: {[key:string]: BehaviorSubject<any[]| null | undefined>} = {}


	constructor(
		private cs: ConfirmationService,
		public r: Router,
		public utilsServ: UtilsService,
		public ar: ActivatedRoute,
		public ts: TripsService,
		public st: StagesService,
		public translate: TranslateService, 
		public driverService: DriversService
	) {

		this.subsetKey = GetFilterKeyFromRoute(this.ts.getFakeEntityObject(),this.ar.snapshot);	
	}

	ngOnInit(): void {
		this.lists["drivers"] = this.driverService.items[allItemsSetKey]; 
		console.log(this.subsetKey);
	}



	
		


}
