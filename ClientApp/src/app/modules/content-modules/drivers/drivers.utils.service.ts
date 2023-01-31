import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DynamicPropertyFilter, EntityFilterOperator, PropertyFilter, PropertyFilterMatchCriteria } from '../../shared/generic/filters/filtering/PropertyFilter';
import { UtilsService } from '../../shared/Utils';
import { Driver } from './models/driver';



@Injectable({
    providedIn: 'root'
})
export class DriverUtilsService {
    constructor(private us: UtilsService) { }

    
    public getDriverTrips() : [PropertyFilter<any> | DynamicPropertyFilter<Driver,any>, EntityFilterOperator | null][]{
        let filter : [PropertyFilter<any> | DynamicPropertyFilter<Driver, any>,EntityFilterOperator | null][] =  [
			[new DynamicPropertyFilter<Driver,any>("driver","uid"), EntityFilterOperator.AND],
            [new PropertyFilter<Date>("startDate", moment().startOf('month').toDate(),  PropertyFilterMatchCriteria.GT),
			EntityFilterOperator.AND],
			[new PropertyFilter<Date>("startDate", moment().endOf('month').toDate(), PropertyFilterMatchCriteria.LT), null]
		]
        return filter;
    }
}
