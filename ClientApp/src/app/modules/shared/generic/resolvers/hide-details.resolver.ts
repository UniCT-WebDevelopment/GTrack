
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IdentificableItem } from '../models/IdentificableItem';
import { DetailsDialogService } from '../services/details-dialog.service';

@Injectable({
    providedIn: 'root'
  })
export class HideDetailsResolver<T extends IdentificableItem> implements Resolve<boolean> {
  constructor(protected dialogService: DetailsDialogService<T>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.dialogService.showDialog.next(false);
    return of(true);  
  }
}