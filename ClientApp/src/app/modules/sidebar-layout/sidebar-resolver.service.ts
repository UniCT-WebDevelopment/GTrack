import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { Menu } from './models/menu';
import { SidebarService } from './sidebar.service';
 
@Injectable({
  providedIn: 'root'
})
export class MenuResolverService implements Resolve<any> {
  constructor(private sidebarService: SidebarService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Menu> {
    return from(this.sidebarService.getMenu());
  }
}