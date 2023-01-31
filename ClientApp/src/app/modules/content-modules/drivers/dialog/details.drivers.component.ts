import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { TripsService } from '../../trips/trips.service';
import { StagesService } from '../../trips/stages.service';
import { TranslateService } from '@ngx-translate/core';
import { GetFilterKeyFromRoute } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { Trip } from '../../trips/models/models';

@Component({
	selector: 'details-drivers',
	templateUrl: './details.drivers.component.html',
	styleUrls: ['./details.drivers.component.scss']
})
export class DetailsDriversComponent {
	labeledIdentifierField: string = "uid";
	entityType = {} as Trip;
	entityName: string = "";
	subsetKey : string;

	cols: TableColumn[] = [
		{
			displayName: this.translate.instant("trips.tripCode"),
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
			displayName: this.translate.instant("drivers.workingHours"),
			columnId: "hours",
			calculationFunction: (item:Trip) => {
				return this.getActiveHours(item) + " ore";
			}
		},
		
	]

	constructor(
		private cs: ConfirmationService,
		public r: Router,
		public utilsServ: UtilsService,
		public ar: ActivatedRoute,
		public ts: TripsService,
		public st: StagesService,
		public translate: TranslateService, 
	) {

		this.subsetKey = GetFilterKeyFromRoute(this.ts.getFakeEntityObject(),this.ar.snapshot)

	}

	getActiveHours(trip :Trip) : number {
		var startDate = trip.startDate;
    	var endDate = trip.endDate;
		var differenceInTime = endDate.getTime() - startDate.getTime();
		var differenceInDays = differenceInTime / (1000 * 3600 * 24);
		var activeHour = trip.activeHoursPerDay ? trip.activeHoursPerDay : 0;
		return differenceInDays * activeHour;
	}


	getTotalHours() : number {
		let mapped = this.ts.items[this.subsetKey].value?.map(trip => {
			return this.getActiveHours(trip)
		})
		if(mapped && mapped.length > 0) 
			return mapped.reduce((pv,cv) => pv+cv); 
		return 0;
	}


	



	
		


}
