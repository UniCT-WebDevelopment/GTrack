import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemsResolver } from 'src/app/modules/shared/generic/resolvers/items.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { CostsService } from '../costs.service';
import { Cost } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CostsResolver extends ItemsResolver<Cost> {
  constructor(itemService: CostsService, dialogService: DialogService<Cost>) {
    super(itemService,dialogService)
  }

  override resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
      var res = super.resolve(route);
      this.dialogService.showDialog.next(true);
      return res;
  }
}