import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemsResolver } from '../../../shared/generic/resolvers/items.resolver';
import { User } from '../models/user';
import { UsersService } from '../users.service';
import { ItemsFilteredResolver } from 'src/app/modules/shared/generic/resolvers/items.filtered.resolver';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { getFilterValue } from 'src/app/modules/shared/generic/filters/filters.helper';
import { ItemsSyncFilteredResolver } from 'src/app/modules/shared/generic/resolvers/items.sync.filtered.resolver';
import { ItemsSyncResolver } from 'src/app/modules/shared/generic/resolvers/items.sync.resolver';
import { GetFilterFromRoute } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { ItemSyncResolver } from 'src/app/modules/shared/generic/resolvers/item.sync.resolver';


@Injectable({
  providedIn: 'root'
})
export class UserFromFilterKeyResolver  {
  constructor(protected itemService: UsersService) {
    
  }
  resolve(route: ActivatedRouteSnapshot): Promise<User| undefined> {
    let userId = this.getUidFromFilterKey(route)
		let user = this.itemService.getItem({uid: userId} as User);
		if(!user) 
			throw new Error("Cannot find the specified user")
    return user;
  }

  private getUidFromFilterKey(route: ActivatedRouteSnapshot) : string{
    let filter = GetFilterFromRoute(this.itemService.getFakeEntityObject(),route)
    if(!filter)
			throw new Error("Cannot find the routing filter")
		let userId = getFilterValue("uid", filter);
		if(!userId) 
			throw new Error("Cannot find the userId from filter")
    return userId;
  }
}