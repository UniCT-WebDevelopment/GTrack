
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiAuthService } from '../../auth/auth.service.api';
import { PropertyFilter, EntityFilterOperator } from '../../shared/generic/filters/filtering/PropertyFilter';
import { ItemsPaginator } from '../../shared/generic/filters/pagination/ItemsPaginator';
import { PropertySorter } from '../../shared/generic/filters/sorting/PropertySorting';
import { ApiService } from '../../shared/generic/services/api.service';
import { CrudService } from '../../shared/generic/services/crud.service';
import { FirestoreBatchService } from '../../shared/generic/services/firestore.batch.service';
import { FirestoreService } from '../../shared/generic/services/firestore.service';
import { UtilsService } from '../../shared/Utils';
import { Driver } from './models/driver';

@Injectable({
    providedIn: 'root'
  })
 export class DriversService extends ApiService<Driver> {
        entityName: string = "drivers"

        constructor(http: HttpClient, private authServ : ApiAuthService){
            super(http, authServ);
        }
    
        protected  getEmptyEntityObject() : Driver {
            return {
                uid: "", 
                email: "", 
                name: "", 
                surname: "", 
                phoneNumber: ""
            } as Driver
        }
   
}
