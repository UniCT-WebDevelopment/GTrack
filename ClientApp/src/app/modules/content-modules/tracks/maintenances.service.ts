import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { nanoid } from 'nanoid';
import { ApiAuthService } from '../../auth/auth.service.api';
import { PropertyFilter } from '../../shared/generic/filters/filtering/PropertyFilter';
import { getFilterFromKey, getFilterValue } from '../../shared/generic/filters/filters.helper';
import { ApiService } from '../../shared/generic/services/api.service';
import { CrudService } from '../../shared/generic/services/crud.service';
import { FirestoreBatchService } from '../../shared/generic/services/firestore.batch.service';
import { FirestoreService } from '../../shared/generic/services/firestore.service';
import { Expiration, PaymentType } from '../trips/models/models';
import { MaintenanceCost, MaintenanceType } from './models/maintenanceCost';
import { Track, TruckType } from './models/track';
import { TracksService } from './tracks.service';

@Injectable({
    providedIn: 'root'
  })
  export class MaintenancesService extends ApiService<MaintenanceCost> {
    entityName: string = "interventions"
    constructor(private http: HttpClient, private truckServ: TracksService, private authServ : ApiAuthService) {
        super(http, authServ);
    }
    
    protected override async createItemInternal(item: MaintenanceCost): Promise<MaintenanceCost | undefined> {
        let currentSubset = getFilterFromKey(this.subsetKey)
        if(!currentSubset){
            throw new Error("Cannot find current subset")
        }
        let truckUid = getFilterValue("track", currentSubset);
        if(!truckUid){
            throw new Error("Cannot find tripUid from current subset filter")
        }
        let truck = await this.truckServ.getItem({uid: truckUid} as Track)
        if(!truck){
            throw new Error("Cannot find truck")
        }
        let newItem: MaintenanceCost = {...item, type: truck.type == TruckType.Trailer ? MaintenanceType.Trailer : MaintenanceType.Truck}
        return super.createItemInternal(newItem);
    }

    protected  getEmptyEntityObject() : MaintenanceCost {
        let intervention: MaintenanceCost = {
            uid: '',
            code: nanoid(4),
            price: 0,
            paymentDetails: '',
            payedBy: '',
            type: '',
            date: new Date(),
            track: ''
        }
        return intervention;
    }     
}
