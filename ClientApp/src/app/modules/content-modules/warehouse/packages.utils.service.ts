import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { EntityFilterOperator, PropertyFilter, PropertyFilterMatchCriteria } from '../../shared/generic/filters/filtering/PropertyFilter';
import { getFilterKey } from '../../shared/generic/filters/filters.helper';
import { ItemsPaginator } from '../../shared/generic/filters/pagination/ItemsPaginator';
import { PropertySorter, PropertySortingType } from '../../shared/generic/filters/sorting/PropertySorting';
import { TableColumn } from '../../shared/models/componentModels';
import { UtilsService } from '../../shared/Utils';
import { Trip } from '../trips/models/models';
import { TripsUtilsService } from '../trips/trips.utils.service';
import { Measures, Package } from './models/package';
import { PackageState } from './models/packageState';


@Injectable({
    providedIn: 'root'
})
export class PackagesUtilsService {
    constructor(private translate: TranslateService, private tripUtils : TripsUtilsService, private utils: UtilsService) {}


	public measuresCols : TableColumn[] = [
		{ //TODO: change with measures
			displayName: this.translate.instant("packages.weight"),
			columnId: "weight",
			dataType: "number",
			measureUnit: "Kg",
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("packages.length"),
			columnId: "length",
			dataType: "number",
			measureUnit: "cm",
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("packages.height"),
			columnId: "height",
			dataType: "number",
			measureUnit: "cm",
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("packages.width"),
			columnId: "width",
			dataType: "number",
			measureUnit: "cm",
			validators: [Validators.required]
		},
	]

    public cols: TableColumn[] = [
		{
			displayName: this.translate.instant("common.code"),
			columnId: "code",
			dataType: "none",
			editable: false
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
			dataType: "genericPicker",
			calculationFunction: (item: Package) => {
				if(!this.utils.isObjectEmpty(item.measures)){
					var length : string = item.measures.length.toString();
					var height : string = item.measures.height.toString();
					var width : string = item.measures.width.toString();
					var weight : string = item.measures.weight.toString();
					var measures : string = length + " x " + height + " x " + width + " cm; " + weight + " kg";
					return measures;
				}
				else return ""
			},
			propertyAggregationFunction : (item: Measures) => {
				if(!this.utils.isObjectEmpty(item)){
					var length : string = item.length ? item.length.toString() : "0";
					var height : string = item.height ? item.height.toString() : "0";
					var width : string = item.width? item.width.toString() : "0";
					var weight : string = item.weight? item.weight.toString() : "0";
					var measures : string = length + " x " + height + " x " + width + " cm; " + weight + " kg";
					return measures;
				}
				else return ""
			},
			nestedCols: this.measuresCols
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
			dataType: "address",
			calculationFunction: (item: Package) => {
				let addressEmpty = this.utils.isObjectEmpty(item.estimatedDestinationAddress)
				if(!addressEmpty){
					let address = item.estimatedDestinationAddress?.streetName + ", " + item.estimatedDestinationAddress?.streetNumber + ", " + item.estimatedDestinationAddress?.city + ", " + item.estimatedDestinationAddress?.postalCode 
					+ ", " + item.estimatedDestinationAddress?.region + ", " + item.estimatedDestinationAddress?.state
					return address;
				}
				else{
					return "";
				}
			}
		},
		{
			displayName: this.translate.instant("common.description"),
			columnId: "description",
			dataType: "text"
		},
		{
			displayName: this.translate.instant("packages.inboundTrip"),
			columnId: "inboundTripUid",
			sourceListName: "trips",
			mappedKey: "code",
			calculatedRouterLink: (item: Package) => {
				return "/admin/trips/trip/edit/" + item.inboundTripUid;
			},
			dataType: "none"
		},
		{
			displayName: this.translate.instant("packages.inboundTripStage"),
			columnId: "inboundStageUid",
			sourceListName: "stages",
			mappedKey: "code",
			dataType: 'none',
			calculatedRouterLink: (item: Package) => {
				if(item.inboundTripUid){
					let filter =  this.tripUtils.getFilterForTripStages(item.inboundTripUid);
					let filterKey = getFilterKey(filter)
					return "/admin/trips/stage/edit/" + filterKey;
				}
				return null;
			},
		},
		{
			displayName: this.translate.instant("packages.outboundTrip"),
			columnId: "outboundTripUid",
			sourceListName: "trips",
			mappedKey: "code",
			dataType: 'none',
			calculatedRouterLink: (item: Package) => {
				return "/admin/trips/trip/edit/" + item.outboundTripUid;
			}
		},
		{
			displayName: this.translate.instant("packages.outboundTripStage"),
			columnId: "outboundStageUid",
			sourceListName: "stages",
			mappedKey: "code",
			dataType: 'none',
			calculatedRouterLink: (item: Package) => {
				if(item.outboundTripUid){
					let filter =  this.tripUtils.getFilterForTripStages(item.outboundTripUid);
					let filterKey = getFilterKey(filter)
					return "/admin/trips/stage/edit/" + filterKey;
				}
				return null;
				
			}
		},
		{
			displayName: this.translate.instant("packages.inboundDate"),
			columnId: "inboundTripUidDate", 
			sourceListName: "trips",
			sourceKey: "inboundTripUid",
			mappedKey: "startDate",
			dataType: "none"
		},
		{
			displayName: this.translate.instant("packages.outboundDate"),
			columnId: "outboundTripUidDate",
			sourceListName: "trips",
			sourceKey: "outboundTripUid",
			mappedKey: "endDate",
			dataType: "none"
		},
		{
			displayName: this.translate.instant("packages.status"),
			columnId: "state",
			dataType: "none",
			calculationFunction: (item: Package, lists: {[key: string]: BehaviorSubject<any[] | null | undefined>;}) => {
				if(!lists["trips"])
					return this.translate.instant("packages.state.inWarehouse")
				var inboundTrip: Trip = lists["trips"].value?.find(i => i.uid == item.inboundTripUid);
				var outboundTrip: Trip = lists["trips"].value?.find(i => i.uid == item.outboundTripUid);
				var today: Date = new Date;
				if (inboundTrip && outboundTrip) {
					if (inboundTrip.startDate >= today && inboundTrip.endDate <= today) {  //if inbound trip started but not finished
						return this.translate.instant("packages.state.inInboundTrip")
					}
					if (inboundTrip.endDate <= today && outboundTrip.startDate > today && outboundTrip.endDate <= today) { //if inbound trip finished but the outbound is not
						return this.translate.instant("packages.state.inWarehouse")
					}
					if (outboundTrip.startDate <= today && outboundTrip.endDate >= today) { //if outbound trip started and not finished
						return this.translate.instant("packages.state.inOutboundTrip")
					}
					if (outboundTrip.startDate <= today && outboundTrip.endDate <= today) { //if outbound trip started and finished
						return this.translate.instant("packages.state.delivered")
					}
				}
				return this.translate.instant("packages.state.inWarehouse")
			}
		},
		{
			displayName: this.translate.instant("common.creationDate"),
			columnId: "creationDate",
			dataType: "none"
		},
	]

	public getPackagesCurrentMonthFilter() : [PropertyFilter<any>, EntityFilterOperator | null][]{
        let datesFilter : [PropertyFilter<any>,EntityFilterOperator | null][] =  [
			[new PropertyFilter<Date>("creationDate", moment().startOf('month').toDate(),  PropertyFilterMatchCriteria.GT),
			EntityFilterOperator.AND],
			[new PropertyFilter<Date>("creationDate", moment().endOf('month').toDate(), PropertyFilterMatchCriteria.LT), null]
		]
        return datesFilter;
    }

}
