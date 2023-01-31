import { Injectable } from '@angular/core';
import { uuidv4 } from '@firebase/util';
import * as moment from 'moment';
import { DynamicPropertyFilter, EntityFilterOperator, PropertyFilter, PropertyFilterMatchCriteria } from '../../shared/generic/filters/filtering/PropertyFilter';
import { UtilsService } from '../../shared/Utils';
import {  StageType, Trip, TripStage } from '../trips/models/models';
import { Package } from '../warehouse/models/package';
import { Customer } from './models/customer';
import { Delivery, DeliveryStateLog } from './models/delivery';


@Injectable({
    providedIn: 'root'
})
export class CustomerUtilsService {
    constructor(private us: UtilsService) { }

    public calculateDeliveries(customerUid: string, packages: Package[], stages: TripStage[], trips: Trip[]): Delivery[] {
        let result: Delivery[] = [];
        let stagesForCustomerUids = stages.filter(s => s.customer == customerUid).map(s => s.uid) //id degli stage del customer
        //filter packages by customer: tutti i pacchi che presentano un id stage o nel campo inboundStageUid o nel campo outboundStageUid (tutti i pacchi associati al customer)
        let packagesForCustomer = packages.filter(p => (p.inboundStageUid && stagesForCustomerUids.includes(p.inboundStageUid)) || (p.outboundStageUid && stagesForCustomerUids.includes(p.outboundStageUid)));
        var groupedItems = this.us.groupBy<Package>(packagesForCustomer, function (item) {
            return [item.inboundStageUid!, item.outboundStageUid!];
        });
        for (let group of groupedItems) {
            let inboundstage = stages.find(s => s.uid == group[0].inboundStageUid);
            let outboundstage = stages.find(s => s.uid == group[0].outboundStageUid);
            let inboundTrip = trips.find(t => t.uid == group[0].inboundTripUid)
            let outboundTrip = trips.find(t => t.uid == group[0].outboundTripUid)
            let deliveryUid = uuidv4()
            let delivery: Delivery = {
                uid: deliveryUid,
                inboundStage: group[0].inboundStageUid ? group[0].inboundStageUid : undefined,
                inboundTrip: group[0].inboundTripUid ? group[0].inboundTripUid : undefined,
                outboundStage: group[0].outboundStageUid ? group[0].outboundStageUid : undefined,
                outboundTrip: group[0].outboundTripUid ? group[0].outboundTripUid : undefined,
                inboundStageCode: inboundstage?.code,
                outboundStageCode: outboundstage?.code,
                inboundTripCode: inboundTrip?.code,
                outboundTripCode: outboundTrip?.code,
                packages: group.length,
                inboundDate: inboundstage?.date,
                outboundDate: outboundstage?.date,
                stateLogs: (inboundstage?.stateLog ?? []).concat(outboundstage?.stateLog ?? []).map(log => {
                    let stateLog: DeliveryStateLog = {
                        uid: uuidv4(),
                        delivery: deliveryUid,
                        date: log.date,
                        state: log.state
                    };
                    return stateLog;
                }),
                customer: customerUid,
                deliveryType: inboundstage?.customer == customerUid ? StageType.withdraw : StageType.delivery,
                sender: inboundstage?.customer,
                recipient: outboundstage?.customer
            };
            result.push(delivery);
        }
        return result;
    }

    //the dates are used to download stages and packages
    public getDeliveriesOfCurrentMonthDynamicFilter() : [PropertyFilter<any> | DynamicPropertyFilter<Customer,any>, EntityFilterOperator | null][]{
        let filter : [PropertyFilter<any> | DynamicPropertyFilter<Customer, any>,EntityFilterOperator | null][] =  [
			[new DynamicPropertyFilter<Customer,any>("customer","uid"), EntityFilterOperator.AND],
            [new PropertyFilter<Date>("inboundDate", moment().startOf('month').toDate(),  PropertyFilterMatchCriteria.GT),
			EntityFilterOperator.AND],
			[new PropertyFilter<Date>("inboundDate", moment().endOf('month').toDate(), PropertyFilterMatchCriteria.LT), null]
		]

        return filter;
    }
}
