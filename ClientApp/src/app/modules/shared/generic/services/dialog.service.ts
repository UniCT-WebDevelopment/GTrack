import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IdentificableItem } from '../models/IdentificableItem';

@Injectable({
    providedIn: 'root'
  })
export class DialogService<T extends IdentificableItem> {
    constructor() {}
    public showDialog : BehaviorSubject<boolean| undefined> = new BehaviorSubject<boolean| undefined>(false);
    public onItemSave : Subject<T|undefined> = new Subject<T|undefined>();
}
