import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';

import { EmailPasswordAuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../content-modules/users/users.service';
import { PropertyFilter } from '../shared/generic/filters/filtering/PropertyFilter';
import { Md5 } from 'md5-typescript';
import { User } from '../content-modules/users/models/user';
import { getBaseUrl } from 'src/main';

@Injectable({
    providedIn: 'root',
})
export class ApiAuthService extends EmailPasswordAuthService {

    constructor(storage: StorageMap, public r: Router, private httpClient: HttpClient) {
        super(storage, r);
    }

    public async executeLogin(email: string, password: string):  Promise<User> {
        return new Promise<User>((res, rej) => {
            this.httpClient.post<User>(getBaseUrl() + "Auth/login", JSON.stringify({email: email, password: Md5.init(password)}), {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).subscribe(result => {
                if(!result)  
                    rej("Cannot get token");
                else{
                    res(result);
                }
            });
        });
    }

    public async executeLogout(user: User) : Promise<void> {
        await this.httpClient.post<User>(getBaseUrl() + "Auth/logout", JSON.stringify(user), {
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

}
