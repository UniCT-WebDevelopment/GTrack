import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ApiAuthService } from '../auth/auth.service.api';
import { RoleType } from '../content-modules/users/models/user';
import { Menu, MenuGroup } from '../sidebar-layout/models/menu';
import { allItemsSetKey } from './GlobalConstants';
@Injectable({
    providedIn: 'root',
})
export class Constants {

    constructor(private translate: TranslateService, private  authServ : ApiAuthService) { }

    public allItemsSetKey = allItemsSetKey;

    private tracksItem = {
      title: this.translate.instant("trucks.entities"),
      icon: "pi-truck",
      route: "tracks"
    } as MenuItem;

    private driversItem = {
      title: this.translate.instant("drivers.entities"),
      icon: "pi-users",
      route: "drivers"
    } as MenuItem;

    private tripsItem = {
      title: this.translate.instant("trips.entities"),
      icon: "pi-map-marker",
      route: "trips"
    } as MenuItem;

    private customersItem = {
      title: this.translate.instant("customer.entities"),
      icon: "pi-briefcase",
      route: "customers"
    } as MenuItem;
   
    private manageGroup = {
      title: this.translate.instant("menu.manage"),
      items : [this.tracksItem, this.driversItem, this.tripsItem, this.customersItem]
    } as MenuGroup;


    private usersItem = {
      title: this.translate.instant("users.entities"),
      icon: "pi-users",
      route: "users",
    } as MenuItem;

    private settingsGroup = {
      title: this.translate.instant("menu.settings"),
      items :[this.usersItem]
    } as MenuGroup;

    // private HistoricalWarehouseItem = {
    //   title: "Historical",
    //   icon: "",
    //   route: "historicalWarehouse"
    // } as MenuItem;

     private currentWarehouseItem = {
      title: this.translate.instant("packages.entities"),
       icon: "pi-inbox",
      route: "warehouse"
    } as MenuItem;

    private warehouseItem = {
      title: this.translate.instant("menu.warehouse"),
      icon: "",
      route: "warehouse",
      items: [this.currentWarehouseItem]
    } as MenuItem;

    public defaultMenu = {
        groups: [ this.manageGroup , this.warehouseItem, this.settingsGroup ]
      } as Menu;

    private operatorManageGroup = {
      title: this.translate.instant("menu.manage"),
      items : [this.tripsItem]
    } as MenuGroup;
  

    public operatorMenu = {
      groups: [ this.operatorManageGroup ]
    } as Menu;

    public async getDefaultMenu() {
      let user = await this.authServ.getUserData();
      if(user.role == RoleType.ADMIN)
        return this.defaultMenu;
      else return this.operatorMenu;
    }

}
