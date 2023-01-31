import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemsResolver } from 'src/app/modules/shared/generic/resolvers/items.resolver';
import { DialogService } from '../../../shared/generic/services/dialog.service';
import { TripStage } from '../models/models';
import { StagesService } from '../stages.service';


@Injectable({
  providedIn: 'root'
})
export class StagesResolver extends ItemsResolver<TripStage> {
  constructor(itemService: StagesService, dialogService: DialogService<TripStage>) {
    super(itemService,dialogService)
  }

  override resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
      var res = super.resolve(route);
      this.dialogService.showDialog.next(true);
      return res;
  }
}