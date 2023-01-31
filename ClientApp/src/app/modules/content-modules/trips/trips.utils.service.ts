import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { EntityFilterOperator, PropertyFilter, PropertyFilterMatchCriteria } from '../../shared/generic/filters/filtering/PropertyFilter';
import { DeliveryStateLog } from '../customers/models/delivery';
import { DeliveryState, StageType, Trip, TripStage, TripStageStateLog } from './models/models';


@Injectable({
    providedIn: 'root'
})
export class TripsUtilsService {
    constructor() {}
    public getFilterForTripStages(tripUid: string) {
        let filter : PropertyFilter<any> | [PropertyFilter<any>, EntityFilterOperator | null][] = [
            [new PropertyFilter<string>("trip", tripUid, PropertyFilterMatchCriteria.EQUALS), EntityFilterOperator.OR],
            [new PropertyFilter<string>("inboundTripUid", tripUid), EntityFilterOperator.OR],
            [new PropertyFilter<string>("outboundTripUid", tripUid), null]  
        ]
        return filter;
    }

    //It should be optimized downloading with 2 queries cause one of them will be in cache
    public getFilterForTripStagePackagesWizard(stage: TripStage) {
        let unassociatedFilter: PropertyFilter<null>  = stage.type == StageType.withdraw ? new PropertyFilter<null>("inboundTripUid", null) : new PropertyFilter<null>("outboundTripUid", null);  
		let filter : PropertyFilter<any> | [PropertyFilter<any>, EntityFilterOperator | null][] = [
			//useful to associate
            [unassociatedFilter, EntityFilterOperator.OR], //put as the first to not make the filter satisfied for a specific inbound trip on creation.
            //useful to deassociate
            [new PropertyFilter<string>("inboundTripUid", stage.trip), EntityFilterOperator.OR],
            [new PropertyFilter<string>("outboundTripUid", stage.trip), null],
			
			
        ]
        return filter;
    }

    public getFilterForTripCosts(tripUid: string) {
        return new PropertyFilter<string>("trip", tripUid);
    }

    public getTripsCurrentMonthFilter() : [PropertyFilter<any>, EntityFilterOperator | null][]{
        let datesFilter : [PropertyFilter<any>,EntityFilterOperator | null][] =  [
			[new PropertyFilter<Date>("startDate", moment().startOf('month').toDate(),  PropertyFilterMatchCriteria.GT),
			EntityFilterOperator.AND],
			[new PropertyFilter<Date>("startDate", moment().endOf('month').toDate(), PropertyFilterMatchCriteria.LT), null]
		]
        return datesFilter;
    }

    public getStagesCurrentMonthFilter() : [PropertyFilter<any>, EntityFilterOperator | null][]{
        let datesFilter : [PropertyFilter<any>,EntityFilterOperator | null][] =  [
			[new PropertyFilter<Date>("date", moment().startOf('month').toDate(),  PropertyFilterMatchCriteria.GT),
			EntityFilterOperator.AND],
			[new PropertyFilter<Date>("date", moment().endOf('month').toDate(), PropertyFilterMatchCriteria.LT), null]
		]
        return datesFilter;
    }

    public getTripsMonthFilter(dateInMonth: Date) : [PropertyFilter<any>, EntityFilterOperator | null][]{
        let datesFilter : [PropertyFilter<any>,EntityFilterOperator | null][] =  [
			[new PropertyFilter<Date>("startDate", moment(dateInMonth).startOf('month').toDate(),  PropertyFilterMatchCriteria.GT),
			EntityFilterOperator.AND],
			[new PropertyFilter<Date>("startDate", moment(dateInMonth).endOf('month').toDate(), PropertyFilterMatchCriteria.LT), null]
		]
        return datesFilter;
    }

    public addStagesLogs(stage: TripStage) : TripStage{
        if(stage.date <= new Date()){
            if(!stage.stateLog)
                stage.stateLog = [];
            if(stage.type == StageType.withdraw ){
                if(stage.stateLog.findIndex((e : TripStageStateLog) => e.state == DeliveryState.inWithdraw) == -1)
                    stage.stateLog.push({state: DeliveryState.inWithdraw, date: stage.date} as TripStageStateLog)
                if(stage.stateLog.findIndex((e : TripStageStateLog) => e.state == DeliveryState.withdrawed) == -1)
                    stage.stateLog.push({state: DeliveryState.withdrawed, date: stage.date} as TripStageStateLog)
            }
            else if(stage.type == StageType.delivery){
                if(stage.stateLog.findIndex((e : TripStageStateLog) => e.state == DeliveryState.inDelivery) == -1)
                    stage.stateLog.push({state: DeliveryState.inDelivery, date: stage.date} as TripStageStateLog)
                if(stage.stateLog.findIndex((e : TripStageStateLog) => e.state == DeliveryState.deliveried) == -1)
                    stage.stateLog.push({state: DeliveryState.deliveried, date: stage.date} as TripStageStateLog)
            }
        }
        return stage;
    }
}
