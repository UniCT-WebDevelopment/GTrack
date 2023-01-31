import { Injectable } from '@angular/core';
import { EntityFilterOperator, PropertyFilter } from '../../shared/generic/filters/filtering/PropertyFilter';
import { CrudService } from '../../shared/generic/services/crud.service';
import { Trip, TripCategories } from './models/models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@firebase/firestore';
import { UtilsService } from '../../shared/Utils';
import { FirestoreService } from '../../shared/generic/services/firestore.service';
import { FirestoreBatchService } from '../../shared/generic/services/firestore.batch.service';
import { StagesService } from './stages.service';
import { CostsService } from './costs.service';
import { nanoid } from 'nanoid';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../shared/generic/services/api.service';
import { ApiAuthService } from '../../auth/auth.service.api';



@Injectable({
    providedIn: 'root'
  })
export  class TripsService extends ApiService<Trip> {
    entityName = "trips";
    constructor(private http: HttpClient, private authServ : ApiAuthService) {
        super(http, authServ);
    }

    protected  getEmptyEntityObject() : Trip {
       let trip : Trip ={
           uid: "",
           code: nanoid(4),
           startDate: new Date(),
           endDate: new Date(),
           amount: 0,
           earnings: 0,
           km: 0,
           durationHours: 0,
           driver: "",
           track: "",
           trailer: "",
           category: TripCategories.lineTrip,
           activeHoursPerDay: 8
       } 
       return trip;
    }
}
