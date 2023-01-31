import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Md5 } from 'md5-typescript';
import { ApiAuthService } from '../../auth/auth.service.api';
import { PropertyFilter, EntityFilterOperator } from '../../shared/generic/filters/filtering/PropertyFilter';
import { ApiService } from '../../shared/generic/services/api.service';
import { CrudService } from '../../shared/generic/services/crud.service';
import { FirestoreBatchService } from '../../shared/generic/services/firestore.batch.service';
import { FirestoreService } from '../../shared/generic/services/firestore.service';
import { User } from './models/user';

@Injectable({
    providedIn: 'root'
  })
  export class UsersService extends ApiService<User> {
    entityName: string = "users"
    defaultPassword = "GtrackPsw"
  
    constructor(private http: HttpClient, private authServ : ApiAuthService) {
        super(http, authServ);
    }

    protected override async createItemInternal(item: User): Promise<User | undefined> {
        item.password = Md5.init(this.defaultPassword);
        return super.createItemInternal(item);
    }

    protected override async updateItemInternal(item: User): Promise<boolean> {
        let usrToUpdate = {...item}
        delete usrToUpdate.password       
        return super.updateItemInternal(usrToUpdate);
    }

    public async updatePassword(item: User) : Promise<boolean> {
        item.password = Md5.init(item.password);
        let token = await this.authServ.getUserToken();
        return new Promise<boolean>((res, rej) => {
          this.http.put<boolean>(this.getUrl()+"/password", item, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization' : token
              }
          }).subscribe(r => {
              if (item)
                  res(r)
              else
                  rej(new Error("Error calling api."));
          })
      })
    }

    public override getEmptyEntityObject(): User {
      let user: User = {
        uid: '',
        name: '',
        surname: '',
        email: '',
        phoneNumber: '',
        password: '',
        lastLogin: new Date(),
        lastLogout: new Date(),
        role: ""
      }
      return user;
    } 
  }