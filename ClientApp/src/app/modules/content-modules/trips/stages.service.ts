import { Injectable } from '@angular/core';
import { EntityFilterOperator, PropertyFilter } from '../../shared/generic/filters/filtering/PropertyFilter';
import { CrudService } from '../../shared/generic/services/crud.service';
import { isMatchingFilter } from '../../shared/generic/filters/filters.helper';
import { DeliveryState, StageType, TripStage } from './models/models';
import { TripsService } from './trips.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { UtilsService } from '../../shared/Utils';
import { FirestoreService } from '../../shared/generic/services/firestore.service';
import { FirestoreBatchService } from '../../shared/generic/services/firestore.batch.service';
import { PackagesService } from '../warehouse/packages.service';
import { Package } from '../warehouse/models/package';
import { TripsUtilsService } from './trips.utils.service';
import { nanoid } from 'nanoid';
import { ApiService } from '../../shared/generic/services/api.service';
import { HttpClient } from '@angular/common/http';
import { ApiAuthService } from '../../auth/auth.service.api';


@Injectable({
    providedIn: 'root'
  })
export  class StagesService extends ApiService<TripStage> {
    entityName = "tripStages";
    
    constructor(protected http: HttpClient, private tripUtilsServ: TripsUtilsService, private authServ : ApiAuthService) {
        super(http, authServ);
    }


    public uploadDocument(item: TripStage, document: any) : Promise<[string?,Error?]>{
        return new Promise<[string?, Error?]>((res, rej) => setTimeout(() =>  res(["pathToDoc", undefined]), 1000))
    }

    protected override createItemInternal(item: TripStage): Promise<TripStage | undefined> {
        item = this.tripUtilsServ.addStagesLogs(item);
        return super.createItemInternal(item);
    }

    protected override updateItemInternal(item: TripStage): Promise<boolean> {
        item = this.tripUtilsServ.addStagesLogs(item);
        return super.updateItemInternal(item);
    }

    protected  getEmptyEntityObject() : TripStage {
        return {
            trip: "",
            code: nanoid(4),
            uid: "",
            type: StageType.withdraw,
            address: {state: "", region:"", city: "", streetName:"", streetNumber:"", postalCode: ""},
            customer : "",
            documents: [],
            labeledAddress : "",
            date : new Date(),
            stateLog: [],
            trackingCode: nanoid(6), //6 number tracking code.
        } as TripStage
    }    
}
