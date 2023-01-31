import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ApiAuthService } from '../../auth/auth.service.api';
import { ApiService } from '../../shared/generic/services/api.service';
import { CrudService } from '../../shared/generic/services/crud.service';
import { FirestoreBatchService } from '../../shared/generic/services/firestore.batch.service';
import { FirestoreService } from '../../shared/generic/services/firestore.service';
import { Expiration, PaymentType } from '../trips/models/models';
import { Track, TruckType } from './models/track';

@Injectable({
    providedIn: 'root'
  })
  export  class TracksService extends ApiService<Track> {
    entityName = "tracks";
    constructor(private http: HttpClient, private authServ : ApiAuthService) {
        super(http, authServ);
    }

    protected  getEmptyEntityObject() : Track {
        let exp : Expiration = {
            effectiveDate: new Date() ,
            cost: 0,
            paymentMethod: PaymentType.Card
        }
        let truck: Track = {
            uid: "",
            licensePlate: "",
            manufacturer: "",
            model: "",
            km: 0,
            type: TruckType.Truck,
            expiration: exp,
            vehicleTax: new Date(),
            inspection: new Date()
        }
        return truck;
    }     
}
