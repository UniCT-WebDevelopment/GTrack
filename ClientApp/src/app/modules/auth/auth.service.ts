import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { lastValueFrom } from 'rxjs';
import { User } from '../content-modules/users/models/user';


export abstract class EmailPasswordAuthService {

    constructor(private storage: StorageMap, private router: Router) { 

    }

    public async login(email: string, password: string): Promise<User> {
        let user = await lastValueFrom(this.storage.get('currentUser')) as User;
        if(user){
            return user;
        }
        try{
            var loginRes = await this.executeLogin(email, password);
            await Promise.all([lastValueFrom(this.storage.set('logged', true)), lastValueFrom(this.storage.set('currentUser', loginRes))]) 
            return loginRes;
        }
        catch(error){
            alert("Wrong Credentials");
            throw(error);
        }
    }

    public async logout() : Promise<void> {
        let user = await lastValueFrom(this.storage.get('currentUser')) as User;
        if(!user)
            throw new Error("Cannot logout cause there is not a current user")
            await Promise.all([lastValueFrom(this.storage.set('logged', false)), lastValueFrom(this.storage.set('currentUser', undefined))]) 
		let res = this.executeLogout(user);
        this.router.navigateByUrl("/auth/login");
        return res;
    }

    //override this method if you need other implementations
    public async isAuthenticated() : Promise<boolean> {
        let user = await lastValueFrom(this.storage.get('currentUser')) as User;
        if(!user)
            return false;
        return (await lastValueFrom(this.storage.get('logged'))) as boolean;
    }

    public async getUserData(): Promise<User>{
        let user = await lastValueFrom(this.storage.get('currentUser')) as User;
        if(user)
            return user;
        throw new Error("No uer logged in");
    }

    public async getUserToken() : Promise<string>{
        let user = await lastValueFrom(this.storage.get('currentUser')) as User;
        if(user)
            return user.jwtToken;
        throw new Error("No uer logged in");
    }

    protected abstract executeLogin(email:string,password: string) : Promise<User>;


    protected abstract executeLogout(user: User) : Promise<void>;
}
