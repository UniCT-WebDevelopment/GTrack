import { Injectable } from '@angular/core';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { ItemsResolver } from '../../../shared/generic/resolvers/items.resolver';
import { User } from '../models/user';
import { UsersService } from '../users.service';


@Injectable({
  providedIn: 'root'
})
export class UsersResolver extends ItemsResolver<User> {
  constructor(itemService: UsersService, dialogService: DialogService<User>) {
    super(itemService,dialogService)
  }
}