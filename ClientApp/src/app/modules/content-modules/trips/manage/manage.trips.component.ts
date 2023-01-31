import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Constants } from 'src/app/modules/shared/Constants';
import { ListItemsController } from 'src/app/modules/shared/generic/controllers/list-items.controller';
import { EntityFilterOperator, PropertyFilter } from 'src/app/modules/shared/generic/filters/filtering/PropertyFilter';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { getFilterKey, getFilterKeyForEntity } from 'src/app/modules/shared/generic/filters/filters.helper';
import { TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { DriversService } from '../../drivers/drivers.service';
import { Driver } from '../../drivers/models/driver';
import { Track } from '../../tracks/models/track';
import { TracksService } from '../../tracks/tracks.service';
import { Package } from '../../warehouse/models/package';
import { PackagesService } from '../../warehouse/packages.service';
import { Trip, TripCategories } from '../models/models';
import { TripsService } from '../trips.service';
import { TripsUtilsService } from '../trips.utils.service';
import { GetFilterKeyFromRoute } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { PaginationDateInterval } from 'src/app/modules/shared/components/datePaginator/models/models';
import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'manage-trips',
	templateUrl: './manage.trips.component.html',
	styleUrls: ['./manage.trips.component.scss']
})
export class ManageTripsComponent extends ListItemsController<Trip> {
	
	labeledIdentifierField: string = "code";
	override dateFilteringPropertyKey = "startDate";
	override interval = PaginationDateInterval.Month
	entityName: string = "Trip";
	labeledTitle: string = this.translate.instant("trips.entity")
	labeledDialogTitle: string = this.translate.instant("common.editItem", {entity:this.labeledTitle}); //TO-DO TRANSLATION
	labeledEntityName: string = "";
	
	cols: TableColumn[] = [ 
		{
			displayName: this.translate.instant("common.code") ,
		 	columnId: "code", 
		},
		{
			displayName: this.translate.instant("common.category") ,
		 	columnId: "category",
			sourceListName: "tripCategories",
			mappedKey: "value" 
		},
		{
			displayName: this.translate.instant("trips.startDate") ,
		 	columnId: "startDate", 
			dataType: "date",
		},
		{
			displayName: this.translate.instant("trips.endDate") ,
		 	columnId: "endDate", 
			dataType: "date"
		},
		{
			displayName: this.translate.instant("trips.km") ,
		 	columnId: "km", 
			measureUnit: "km" 
		},
		{
			displayName: this.translate.instant("trips.duration") ,
		 	columnId: "durationHours",
			calculationFunction: (item: Trip) => {	
				if(!this.us.isObjectEmpty(item)){
					var startDate = item.startDate;
					var endDate = item.endDate;
					var differenceInTime = endDate.getTime() - startDate.getTime();
					var differenceInDays = differenceInTime / (1000 * 3600 * 24);
					return differenceInDays;
				}
				return 0;
			}
		},
		{
			displayName: this.translate.instant("drivers.entity") ,
		 	columnId: "driver", 
			sourceListName: "drivers",
			mappedKey: "surname"
		},
		{
			displayName: this.translate.instant("trucks.entity") ,
		 	columnId: "track", 
			sourceListName: "tracks",
			mappedKey: "licensePlate"
		},
		{
			displayName: this.translate.instant("trailers.entity") ,
		 	columnId: "trailer", 
			sourceListName: "tracks",
			mappedKey: "licensePlate"
		},
		]

	constructor(
		public es : TripsService,
		public ds : DialogService<Trip>,
		private cs : ConfirmationService,
		public r: Router,
		public utilsServ: UtilsService,
		private driversService: DriversService,
		private tracksService: TracksService,
		private packagesService: PackagesService,
		private constants: Constants,
		private tripsUtilsServ : TripsUtilsService,
		protected arou: ActivatedRoute,
		private translate: TranslateService
		
	) {
		super(es,ds,cs,r,utilsServ,arou, translate)
	}

	

	override async ngOnInit(): Promise<void> {
		let filterKey = getFilterKey(this.tripsUtilsServ.getTripsCurrentMonthFilter());
		this.setSubsetKey(filterKey);
		this.lists['drivers'] = this.driversService.items[this.constants.allItemsSetKey]
		this.lists['tracks'] = this.tracksService.items[this.constants.allItemsSetKey]
		this.lists['tripCategories'] = new BehaviorSubject<any[] | null | undefined>(this.utilsServ.enumToObjects(TripCategories).map(e => ({...e, value :  this.translate.instant("trips.categories."+ (e.value as string).toLowerCase())})));
		await super.ngOnInit();
	}

	getFilterKeyForStagesRouterLink(item: Trip){
		return getFilterKey(this.tripsUtilsServ.getFilterForTripStages(item.uid));
	}

	getFilterKeyForCostsRouterLink(item: Trip){
		return getFilterKey(this.tripsUtilsServ.getFilterForTripCosts(item.uid));
	}
}
