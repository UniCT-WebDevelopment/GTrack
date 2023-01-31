import { Injectable, Injector } from '@angular/core';
import { EntityFilterOperator, PropertyFilter } from '../../shared/generic/filters/filtering/PropertyFilter';
import { CrudService } from '../../shared/generic/services/crud.service';
import { getFilterForEntity, getFilterFromKey, getFilterKey, getFilterValue, isMatchingFilter } from '../../shared/generic/filters/filters.helper';
import { Cost, CostType, Trip } from './models/models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from '../../shared/Utils';
import { Timestamp } from '@angular/fire/firestore';
import { FirestoreService } from '../../shared/generic/services/firestore.service';
import { FirestoreBatchService } from '../../shared/generic/services/firestore.batch.service';
import { TripsService } from './trips.service';
import { MaintenancesService } from '../tracks/maintenances.service';
import { MaintenanceCost } from '../tracks/models/maintenanceCost';
import { TruckType } from '../tracks/models/track';
import { filter } from 'rxjs';
import { nanoid } from 'nanoid';
import { ApiService } from '../../shared/generic/services/api.service';
import { HttpClient } from '@angular/common/http';
import { ApiAuthService } from '../../auth/auth.service.api';


@Injectable({
    providedIn: 'root'
})
export  class CostsService extends ApiService<Cost> {
    entityName: string = "tripCosts"
    constructor(private http: HttpClient, private maintainanceServ: MaintenancesService, private injector: Injector, private authServ : ApiAuthService) {
        super(http, authServ);
    }


    public override async createItemInternal(item: Cost): Promise<Cost | undefined> {
        //get parent trip
        let currentSubset = getFilterFromKey(this.subsetKey)
        if(!currentSubset){
            throw new Error("Cannot find current subset")
        }
        let tripUid = getFilterValue("trip", currentSubset);
        if(!tripUid){
            throw new Error("Cannot find tripUid from current subset filter")
        }

        const tripsServ = this.injector.get<TripsService>(TripsService);
        let trip = await tripsServ.getItem({ uid: tripUid } as Trip);
        if (!trip) {
            throw new Error("Cannot find related trip for cost with uid: " + item.uid);
        }
        if(item.type == CostType.Trailer && !trip.trailer){
            throw new Error("Trying to update a trailer costs for a trip without any trailer");
        }
       
        if (item.type == CostType.Trailer || item.type == CostType.Truck) {
            let trackUid = item.type == CostType.Trailer ? trip.trailer : trip.track;
            this.maintainanceServ.setQueryContext("track", trackUid!, "interventions");
            let m : MaintenanceCost = {
                uid: item.uid,
                code: item.code,
                price: item.price,
                paymentDetails: item.paymentDetails,
                payedBy: item.payedBy,
                type: item.type,
                date: item.date,
                trip: tripUid,
                track: trackUid!
            }
            let res = await this.maintainanceServ.createItem(m,true);
            if(res)
                return {...item, uid: res.uid }
            else return undefined
        }
        else{
            return super.createItemInternal(item);
        }
    }

    public override async updateItemInternal(item: Cost): Promise<boolean> {
        const tripsServ = this.injector.get<TripsService>(TripsService);
        let trip = await tripsServ.getItem({ uid: item.trip } as Trip);
        if (!trip) {
            throw new Error("Cannot find related trip for cost with uid: " + item.uid);
        }
      
        if(item.type == CostType.Trailer && !trip.trailer){
            console.warn("Trying to update a trailer costs for a trip without any trailer!");
            return false;
        }
        if (item.type == CostType.Trailer || item.type == CostType.Truck) {
            let trackUid = item.type == CostType.Trailer ? trip.trailer : trip.track;
            this.maintainanceServ.setQueryContext("track", trackUid!, "interventions");
            let m: MaintenanceCost = {
                uid: item.uid,
                code: item.code,
                price: item.price,
                paymentDetails: item.paymentDetails,
                payedBy: item.payedBy,
                type: item.type,
                date: item.date,
                trip: item.trip,
                track: trackUid!
            }
            return await this.maintainanceServ.editItem(m, true);
        }
        else{
            return super.updateItemInternal(item);
        }
    }

    public override async deleteItemInternal(item: Cost): Promise<boolean> {
        const tripsServ = this.injector.get<TripsService>(TripsService);
        let trip = await tripsServ.getItem({ uid: item.trip } as Trip);
        if (!trip) {
            throw new Error("Cannot find related trip for cost with uid: " + item.uid);
        }
      
        if(item.type == CostType.Trailer && !trip.trailer){
            console.warn("Trying to update a trailer costs for a trip without any trailer!");
            return false;
        }
        if (item.type == CostType.Trailer || item.type == CostType.Truck) {
            let trackUid = item.type == CostType.Trailer ? trip.trailer : trip.track;
            this.maintainanceServ.setQueryContext("track", trackUid!, "interventions");
            return await this.maintainanceServ.deleteItem({uid: item.uid } as MaintenanceCost);
        }
        else{
            return super.deleteItemInternal(item);
        }
    }

    public override async readFilteredItemsInternal(item: Cost | null | undefined, filters: PropertyFilter<any> | [PropertyFilter<any>, EntityFilterOperator | null][], reloadCache?: boolean): Promise<Cost[] | undefined> {
        const tripsServ = this.injector.get<TripsService>(TripsService);
        let filter = getFilterValue('trip',filters);
        let trip = await tripsServ.getItem({uid: filter} as Trip)
        if(!trip){
            throw new Error("Cannot find related trip for cost");
        }          
        let tripCosts = await super.readFilteredItemsInternal(null, filters)  ?? []
   
        let allItems = tripCosts;
        if(trip.trailer){
            let allMaintainances = await Promise.all([this.getMaintenances(trip.track, filters),this.getMaintenances(trip.trailer, filters)]);
            allItems = allItems.concat(allMaintainances[0]);
            allItems = allItems.concat(allMaintainances[1]);
        }
        else{ //we always have a truck
            let truckMaintainances = await this.getMaintenances(trip.track, filters);
            allItems = allItems.concat(truckMaintainances);
        }   
        return allItems;
    }


    private async getMaintenances(truckUid: string,filters: PropertyFilter<any> | [PropertyFilter<any>, EntityFilterOperator | null][]) : Promise<MaintenanceCost[]> {
        this.maintainanceServ.setQueryContext("track", truckUid, "interventions")
        if(filters instanceof Array){
            filters = filters.filter(f => f[0].key == "trip");
        }
        else if (filters instanceof PropertyFilter){
            if(filters.key != "trip") {
                throw new Error("cannot find trip peroperty in filter")
            }
        }
        let maintenances = await this.maintainanceServ.getFilteredItems(null, filters) ?? []
        return maintenances;
    }



    protected  getEmptyEntityObject() : Cost {
        return {
            uid: "",
            code: nanoid(4),
            trip: "",
            isoDate: "",
            description: "",
            price: 0,
            paymentDetails: "",
            payedBy: "",
            type: CostType.Truck.toString(),
            date: new Date()
        } as Cost
    }
}