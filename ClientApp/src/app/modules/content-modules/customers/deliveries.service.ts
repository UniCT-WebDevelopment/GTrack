import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { getFilterValue, isMatchingFilter } from '../../shared/generic/filters/filters.helper';
import { PropertyFilter, EntityFilterOperator, PropertyFilterMatchCriteria } from '../../shared/generic/filters/filtering/PropertyFilter';
import { CrudService } from '../../shared/generic/services/crud.service';
import { UtilsService } from '../../shared/Utils';
import { StageType, Trip, TripStage } from '../trips/models/models';
import { StagesService } from '../trips/stages.service';
import { Package } from '../warehouse/models/package';
import { PackagesService } from '../warehouse/packages.service';
import { Delivery } from './models/delivery';
import { CustomerUtilsService } from './customer.utils.service';
import { TripsService } from '../trips/trips.service';
import { documentId } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export abstract class DeliveryService extends CrudService<Delivery> {
    constructor(
        public st: StagesService,
        public ts: TripsService,
        public ps: PackagesService,
        private custUtils: CustomerUtilsService
    ) {
        super();
    }

    protected override readFilteredItemsInternal(item: Delivery, filters: [PropertyFilter<any>,EntityFilterOperator | null][]| PropertyFilter<any>) : Promise<Delivery[] | undefined> {
        if(filters instanceof PropertyFilter){
            throw new Error("Cannot find dates filters to get Deliveries, since the filter is not an array.")
        }
        return new Promise<Delivery[] | undefined>((res, rej) => {
                this.getDeliveries(filters).then(filteredData => res(filteredData))
        })
    }

    private async getDeliveries(filter: [PropertyFilter<any>,EntityFilterOperator | null][]) : Promise<Delivery[]>{
        let customerUid = getFilterValue("customer",filter);
        if(customerUid == null)
            throw new Error("Cannot get customerUid from Filter");
        //turn the filter usable for stages
        filter.filter(f => f[0].key != "customer").forEach(f=> f[0].key = "date"); 
        let stagesForCustomer = await this.st.getFilteredItems(null, filter) ?? [];
        let stagesUidsSet = new Set(stagesForCustomer.map( s => s.uid))
        let tripUidsSet = new Set((stagesForCustomer ?? []).map(s => s.trip));
        let tripsForCustomerUids = [...tripUidsSet]
        if(stagesForCustomer.length > 0){
            let packagesFilter : [PropertyFilter<Array<string>>, EntityFilterOperator | null][]   = [
                [ new PropertyFilter("inboundTripUid", tripsForCustomerUids, PropertyFilterMatchCriteria.IN), EntityFilterOperator.OR],
                [ new PropertyFilter("outboundTripUid", tripsForCustomerUids, PropertyFilterMatchCriteria.IN), null],
            ]
            let packages = await this.ps.getFilteredItems(null, packagesFilter) ?? [];
            let remainingStagesUids : string[] = packages.map(p => {
                if(tripUidsSet.has(p.inboundTripUid!) && !stagesUidsSet.has(p.outboundStageUid!)){
                    return p.outboundStageUid;
                }
                if (tripUidsSet.has(p.outboundTripUid!) && !stagesUidsSet.has(p.inboundStageUid!)){
                    return p.inboundStageUid;
                }
                return null;
            }).filter(r => r != null) as string[];

            let remainingTripUids : string[] = packages.map(p => {
                if(tripUidsSet.has(p.inboundTripUid!) && !tripUidsSet.has(p.outboundTripUid!) ){
                    return  p.outboundTripUid;
                }
                if (tripUidsSet.has(p.outboundTripUid!) && !tripUidsSet.has(p.inboundTripUid!)){
                    return  p.inboundTripUid;
                }
                return null;
            }).filter(r => r != null) as string[];

            let stages : TripStage[] = stagesForCustomer;
            let trips : Trip[] = [];
            //download all trip and remainingStages if necessary 
            let allTripsUids = [...tripsForCustomerUids, ...remainingTripUids];
            let tripsFilter : PropertyFilter<Array<string>> = new PropertyFilter("uid", allTripsUids, PropertyFilterMatchCriteria.IN)
            if(remainingStagesUids.length > 0){
                let remainingStagesFilter : PropertyFilter<Array<string>> = new PropertyFilter("uid", remainingStagesUids, PropertyFilterMatchCriteria.IN)
                let stagesProm = this.st.getFilteredItems(null, remainingStagesFilter);
                let tripsProm = this.ts.getFilteredItems(null, tripsFilter);
                let res = await Promise.all([stagesProm,tripsProm]);
                stages = stages.concat(res[0] ?? []);
                trips = res[1] ?? [];
            }
            else{
                //donwload only trips
                let res = await this.ts.getFilteredItems(null, tripsFilter);
                trips = res ??[];
            }
      
            let deliveries =  this.custUtils.calculateDeliveries(customerUid,packages,stages,trips);
            return deliveries;
        }
        else return [];
    }

    protected  getEmptyEntityObject() : Delivery {
        let item : Delivery =  {
            uid: "",sender: "", recipient: "", customer: "", inboundTrip: "", outboundTrip: "", inboundStage: "", outboundStage: "", deliveryType: StageType.delivery,
            stateLogs: [], inboundDate: new Date() , outboundDate: new Date(), inboundStageCode: "", outboundStageCode: ""
        }
        return item;
    }

}