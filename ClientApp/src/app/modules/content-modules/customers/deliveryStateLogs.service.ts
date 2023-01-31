import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { getFilterValue, isMatchingFilter } from '../../shared/generic/filters/filters.helper';
import { PropertyFilter, EntityFilterOperator } from '../../shared/generic/filters/filtering/PropertyFilter';
import { CrudService } from '../../shared/generic/services/crud.service';
import { UtilsService } from '../../shared/Utils';
import { DeliveryState, StageType } from '../trips/models/models';
import { StagesService } from '../trips/stages.service';
import { Package } from '../warehouse/models/package';
import { PackagesService } from '../warehouse/packages.service';
import { Delivery, DeliveryStateLog } from './models/delivery';
import { CustomerUtilsService } from './customer.utils.service';
import { DeliveryService } from './deliveries.service';

@Injectable({
    providedIn: 'root'
})
export abstract class DeliveryStateLogsService extends CrudService<DeliveryStateLog> {
    constructor(
        public ds: DeliveryService,
    ) {
        super();
    }

    protected override readFilteredItemsInternal(item: DeliveryStateLog, filters: [PropertyFilter<any>,EntityFilterOperator | null][]| PropertyFilter<any>) : Promise<DeliveryStateLog[] | undefined> {
        return new Promise<DeliveryStateLog[] | undefined>((res, rej) => {
                let deliveryUid = getFilterValue("delivery",filters);
                if(deliveryUid == null)
                    throw new Error("Cannot find DeliveryUid in Filter");
                this.getStateLogs(deliveryUid).then(filteredData => res(filteredData))
        })
    }

    private async getStateLogs(deliveryUid: string) : Promise<DeliveryStateLog[]>{
        let delivery = (await this.ds.getItem({uid: deliveryUid} as Delivery))
        if(delivery)
            return delivery.stateLogs;
        else 
            return [];
    }

    protected  getEmptyEntityObject() : DeliveryStateLog {
        return {uid: "", delivery: "", state: DeliveryState.inWithdraw, date: new Date()} as DeliveryStateLog; 
    }

}