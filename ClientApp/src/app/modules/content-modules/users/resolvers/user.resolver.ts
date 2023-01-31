import { Injectable } from '@angular/core';
import { ItemResolver } from 'src/app/modules/shared/generic/resolvers/item.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { User } from '../models/user';
import { UsersService } from '../users.service';


@Injectable({
  providedIn: 'root'
})
export class UserResolver extends ItemResolver<User> {
  constructor(itemService: UsersService, dialogService: DialogService<User>) {
    super(itemService,dialogService)
  }
}