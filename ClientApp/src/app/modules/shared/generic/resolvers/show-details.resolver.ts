
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IdentificableItem } from '../models/IdentificableItem';
import { DetailsDialogService } from '../services/details-dialog.service';

@Injectable({
    providedIn: 'root'
  })
export class ShowDetailsResolver<T extends IdentificableItem> implements Resolve<boolean> {
  constructor(protected dialogService: DetailsDialogService<T>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    console.log("open dialog")
    this.dialogService.showDialog.next(true);
    return of(true);  
  }
}