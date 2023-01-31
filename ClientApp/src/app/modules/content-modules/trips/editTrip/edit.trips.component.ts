import { ChangeDetectorRef, Component, ViewChild} from '@angular/core'
import { ActivatedRoute, Router} from '@angular/router';
import { BehaviorSubject, combineLatest, filter, Observable } from 'rxjs';
import { Constants } from 'src/app/modules/shared/Constants';
import { EditItemController } from 'src/app/modules/shared/generic/controllers/edit-item.controller';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { getFilterKey } from 'src/app/modules/shared/generic/filters/filters.helper';
import { getAbsolutePathFromRelative } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { DynamicValidator, MinDateValidator, TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { DriversService } from '../../drivers/drivers.service';
import { Driver } from '../../drivers/models/driver';
import { Track, TruckType } from '../../tracks/models/track';
import { TracksService } from '../../tracks/tracks.service';
import { Trip, TripCategories, TripStage } from '../models/models';
import { TripsService } from '../trips.service';
import { TripsUtilsService } from '../trips.utils.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators } from '@angular/forms';
import { NestedTableComponent } from 'src/app/modules/shared/components/nestedTable/nested-table.component';

@Component({
	selector: 'edit-trips',
	templateUrl: './edit.trips.component.html',
	styleUrls: ['./edit.trips.component.scss']
})
export class EditTripsComponent extends EditItemController<Trip> {

	cols: TableColumn[] = [ 
		{
			displayName: this.translate.instant("common.code") ,
		 	columnId: "code", 
			validators: [Validators.required],
			immutableIfDefined: true

		},
		{
			displayName: this.translate.instant("trips.startDate") ,
		 	columnId: "startDate", 
			dataType: "date",
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("trips.endDate") ,
		 	columnId: "endDate", 
			dataType: "date",
			validators: [Validators.required],
			dynamicValidatorsFunction : (item: Trip) : DynamicValidator[]  =>  {
				return [new MinDateValidator(item.startDate)]
			}
		},
		{
			displayName: this.translate.instant("trips.km"),
		 	columnId: "km",
			measureUnit: "km",
			dataType: "number"
		},
		{
			displayName: this.translate.instant("trips.activeHours"),
			columnId: "activeHoursPerDay",
			dataType:"number",
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("drivers.entity") ,
		 	columnId: "driver", 
			sourceListName: 'drivers',
			mappedKey: 'name',
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("trucks.entity") ,
		 	columnId: "track",
			sourceListName : 'tracks',
			mappedKey: 'licensePlate',
			validators: [Validators.required] 
		},
		{
			displayName: this.translate.instant("trucks.entity") ,
		 	columnId: "trailer",
			sourceListName : 'trailers',
			mappedKey: 'licensePlate' 
		},
		]


		trucksSubject = new BehaviorSubject<Track[] | null | undefined>([]);
		trailersSubject = new BehaviorSubject<Track[] | null | undefined>([]);

	constructor(
		detector : ChangeDetectorRef,
		protected service : TripsService,
		private driversService: DriversService,
		private trucksService: TracksService,
		protected route: ActivatedRoute,
		protected ds: DialogService<Trip>,
		private router: Router,
		public u: UtilsService,
		public constants: Constants,
		private tripUtils: TripsUtilsService,
		private translate: TranslateService
	) {
		super(detector,service,ds,u);
	}


	override ngOnInit(): void {
		this.trucksService.items[this.constants.allItemsSetKey].subscribe(trucks => {
			this.trucksSubject.next(trucks?.filter(t => t.type == TruckType.Truck));
			this.trailersSubject.next(trucks?.filter(t => t.type == TruckType.Trailer));
		})
		this.lists['drivers'] = this.driversService.items[this.constants.allItemsSetKey]
		this.lists['trucks'] = this.trucksSubject
		this.lists['trailers'] = this.trailersSubject
		this.lists['tripCategories'] = new BehaviorSubject<any[] | null | undefined>(this.u.enumToObjects(TripCategories).map(e => ({...e, value :  this.translate.instant("trips.categories."+ (e.value as string).toLowerCase())})));
		super.ngOnInit();
	}

	public override saveChanges(): Observable<boolean> {
		//using this concept to avoid specific dialog services
		let sub = this.ds.onItemSave.subscribe(item => {
			if(item){
				let filter = this.tripUtils.getFilterForTripStages(item.uid)
				let filterKey = getFilterKey(filter);
				var path = getAbsolutePathFromRelative(this.router.url,'../../../stage/edit/'+ filterKey)
				this.router.navigateByUrl(path); 
				sub.unsubscribe();
			}
		})
		return super.saveChanges();		
	}

	isNextButtonDisabled(form: FormGroup){
		//if we are in creating, only when the form is valid and touched. otherwise always enabled
		if(!this._item)
			return !form.valid || !form.touched;
		else return !form.valid;

	}
}
