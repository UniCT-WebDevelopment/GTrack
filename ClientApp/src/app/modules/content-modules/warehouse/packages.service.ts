import { Injectable } from '@angular/core';
import { EntityFilterOperator, PropertyFilter } from '../../shared/generic/filters/filtering/PropertyFilter';
import { CrudService } from '../../shared/generic/services/crud.service';
import { isMatchingFilter } from '../../shared/generic/filters/filters.helper';
import { Measures, Package, PackageType } from './models/package';
import { ItemsPaginator } from '../../shared/generic/filters/pagination/ItemsPaginator';
import { PropertySorter } from '../../shared/generic/filters/sorting/PropertySorting';
import { FirestoreService } from '../../shared/generic/services/firestore.service';
import { FirestoreBatchService } from '../../shared/generic/services/firestore.batch.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Address, StageType } from '../trips/models/models';
import { nanoid } from 'nanoid';
import { ApiService } from '../../shared/generic/services/api.service';
import { HttpClient } from '@angular/common/http';
import { ApiAuthService } from '../../auth/auth.service.api';

@Injectable({
    providedIn: 'root'
  })
  export class PackagesService extends ApiService<Package> {
    entityName: string = "packages"
    constructor(private http: HttpClient, private authServ : ApiAuthService) {
        super(http, authServ);
    }


    public override async createItemInternal(item: Package): Promise<Package | undefined> {
        let newItem = {...item, creationDate: new Date()};
        if(!newItem.inboundTripUid){ //null uids are used to make a query for disassociated packages.
            newItem.inboundTripUid = null;
            newItem.inboundStageUid = null;
        }
        if(!newItem.outboundTripUid){
            newItem.outboundTripUid = null;
            newItem.outboundStageUid = null;
        }
        return super.createItemInternal(newItem); //put the date of creation.
    }

    protected  getEmptyEntityObject() : Package {
        let estAddr : Address = {
            streetName: '',
            streetNumber: '',
            city: '',
            postalCode: '',
            region: '',
            state: ''
        }
        let measures: Measures = {
            weight: 0,
            length: 0,
            height: 0,
            width: 0
        }
        let p : Package = {
            uid: "", code: nanoid(4), description: "", inboundStageUid: null, inboundTripUid: null, outboundStageUid: null, outboundTripUid: null, creationDate: new Date(),
            type: PackageType.package,
            estimatedDestinationArea: '',
            estimatedDestinationAddress: estAddr,
            measures: measures
        }
        return p;
    }

}
