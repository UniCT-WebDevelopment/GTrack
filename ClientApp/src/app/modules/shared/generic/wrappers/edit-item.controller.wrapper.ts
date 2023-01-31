import { ChangeDetectorRef, Input } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TableColumn } from 'src/app/modules/shared/models/componentModels';
import { allItemsSetKey } from '../../GlobalConstants';
import { UtilsService } from '../../Utils';
import { EditItemController } from '../controllers/edit-item.controller';;
import { IdentificableItem } from '../models/IdentificableItem';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';


export class EditItemControllerWrapper<T extends IdentificableItem> extends EditItemController<T> {
	
	cols: TableColumn[] = []

	constructor(
		private c : ChangeDetectorRef,
		private e: CrudService<T>,
		private d: DialogService<T>,
		public u: UtilsService,
		cols: TableColumn[],
		lists: {[key:string]: BehaviorSubject<any[] | null | undefined>},
		subsetKey: string = allItemsSetKey
	) {
		super(c,e,d,u);
		this.cols = cols;
		this.lists = lists;
		this.subsetKey = subsetKey;
		if(!e.item) e.item = new BehaviorSubject<T | undefined | null>(undefined);
	 }

	 public override saveChanges(): Observable<boolean> {
		let result = new Subject<boolean>();
		super.saveChanges().subscribe(res => {
			this.d.showDialog.next(false);
			result.next(res);
		})
		return result;
	 }
}