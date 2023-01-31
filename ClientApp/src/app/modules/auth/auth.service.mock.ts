import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { User } from '../content-modules/users/models/user';
import { EmailPasswordAuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class MockAuthService extends EmailPasswordAuthService {

    constructor(storage: StorageMap, public r: Router) {
        super(storage, r);
    }

    private mockUser : User = {name: "Simone", surname: "Scionti", password: "Admin1",  email: "scionti@codedix.com", uid: "u1", phoneNumber : "3913521516"};

    public async executeLogin(email: string, password: string):  Promise<User> {
       
            return new Promise<User>((res, rej) => {
                if(email == this.mockUser.email && password == this.mockUser.password)
                    res(this.mockUser)
                else 
                    rej(new Error("Cannot find the user"));
            } )
    }

    public async executeGetUserData(uid: string):  Promise<User> {
        return new Promise<User>((res, rej) => res(this.mockUser))
    }

    public executeLogout() : Promise<void> {
        return new Promise<void>((res, rej) => res())
    }

}
