import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ApiAuthService } from '../../auth/auth.service.api';
import { ApiService } from '../../shared/generic/services/api.service';
import { CrudService } from '../../shared/generic/services/crud.service';
import { FirestoreBatchService } from '../../shared/generic/services/firestore.batch.service';
import { FirestoreService } from '../../shared/generic/services/firestore.service';
import { Address } from '../trips/models/models';
import { Customer } from './models/customer';

@Injectable({
    providedIn: 'root'
  })
  export class CustomersService extends ApiService<Customer> {
    entityName = "customers";
    constructor(private http: HttpClient, private authServ : ApiAuthService) {
        super(http, authServ);
    }

    protected  getEmptyEntityObject() : Customer {
        return {
            uid: "", 
            name: "", 
            surname: "", 
            email: "", 
            phoneNumber: "",
            address: {state: "", region:"", city: "", streetName:"", streetNumber:"", postalCode: ""},
            businessName: ""
        } as Customer
    }
}