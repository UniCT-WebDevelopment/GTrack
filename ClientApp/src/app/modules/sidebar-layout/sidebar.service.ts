import { Injectable } from '@angular/core';
import { ActivatedRoute, Resolve } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../shared/Constants';
import { Menu } from './models/menu';

 
@Injectable({
  providedIn: 'root'
})
export class SidebarService{
  constructor(private constants: Constants) {}
  private menu? : Menu;

  //public $menu: BehaviorSubject<Menu>
  public async getMenu() : Promise<Menu>{
    
      this.menu = await this.constants.getDefaultMenu()
      return this.menu;
    
  }
}
