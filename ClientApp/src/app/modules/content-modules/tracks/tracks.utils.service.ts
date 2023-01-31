import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DynamicPropertyFilter, EntityFilterOperator, PropertyFilter, PropertyFilterMatchCriteria } from '../../shared/generic/filters/filtering/PropertyFilter';
import { UtilsService } from '../../shared/Utils';
import { Track } from './models/track';



@Injectable({
    providedIn: 'root'
})
export class TracksUtilsService {
    constructor(private us: UtilsService) { }

    public getTripsOfTrucks() : [PropertyFilter<any> | DynamicPropertyFilter<Track,any>, EntityFilterOperator | null][]{
        let filter : [PropertyFilter<any> | DynamicPropertyFilter<Track, any>,EntityFilterOperator | null][] =  [
			[new DynamicPropertyFilter<Track,any>("track","uid"), EntityFilterOperator.AND],
            [new PropertyFilter<Date>("startDate", moment().startOf('month').toDate(),  PropertyFilterMatchCriteria.GT),
			EntityFilterOperator.AND],
			[new PropertyFilter<Date>("startDate", moment().endOf('month').toDate(), PropertyFilterMatchCriteria.LT), null]
		]
        return filter;
    }

    public getMaintenanceOfTruck() : [PropertyFilter<any> | DynamicPropertyFilter<Track,any>, EntityFilterOperator | null][]{
        let filter : [PropertyFilter<any> | DynamicPropertyFilter<Track, any>,EntityFilterOperator | null][] =  [
			[new DynamicPropertyFilter<Track,any>("track","uid", PropertyFilterMatchCriteria.EQUALS, "interventions"), EntityFilterOperator.AND],
            [new PropertyFilter<Date>("date", moment().startOf('month').toDate(),  PropertyFilterMatchCriteria.GT),
			EntityFilterOperator.AND],
			[new PropertyFilter<Date>("date", moment().endOf('month').toDate(), PropertyFilterMatchCriteria.LT), null]
		]
        return filter;
    }



}