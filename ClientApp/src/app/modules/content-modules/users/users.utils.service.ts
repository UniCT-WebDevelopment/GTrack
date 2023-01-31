import { Injectable } from '@angular/core';
import { uuidv4 } from '@firebase/util';
import * as moment from 'moment';
import { DynamicPropertyFilter, EntityFilterOperator, PropertyFilter, PropertyFilterMatchCriteria } from '../../shared/generic/filters/filtering/PropertyFilter';
import { UtilsService } from '../../shared/Utils';
import {  StageType, Trip, TripStage } from '../trips/models/models';
import { Package } from '../warehouse/models/package';
import { User } from './models/user';




@Injectable({
    providedIn: 'root'
})
export class UsersUtilsService {
    constructor(private us: UtilsService) { }
    //the dates are used to download stages and packages
    public getUserDynamicFilter() : [PropertyFilter<any> | DynamicPropertyFilter<User,any>, EntityFilterOperator | null][]{
        let filter : [PropertyFilter<any> | DynamicPropertyFilter<User, any>,EntityFilterOperator | null][] =  [
			[new DynamicPropertyFilter<User,any>("uid","uid"), null],
		]
        return filter;
    }
}
