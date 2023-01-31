import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { AbstractControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { EditItemController } from 'src/app/modules/shared/generic/controllers/edit-item.controller';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { IdentificableItem } from '../../generic/models/IdentificableItem';
import { CrudService } from '../../generic/services/crud.service';
import { EditItemControllerWrapper } from '../../generic/wrappers/edit-item.controller.wrapper';
import { allItemsSetKey } from '../../GlobalConstants';
import { TableColumn } from '../../models/componentModels';
import { UtilsService } from '../../Utils';

@Component({
	selector: 'edit-item',
	templateUrl: './edit.item.component.html',
	styleUrls: ['./edit.item.component.scss']
})
export class EditItemComponent<T extends IdentificableItem>  implements OnInit{

	@Input() subsetKey: string = allItemsSetKey
	@Input() entityType: T | null = null;
	@Input() entityService: CrudService<T> | null = null;
 	@Input() dialogService: DialogService<T> | null = null;
	@Input() cols : TableColumn[] = [];
	@Input() lists: {[key:string]: BehaviorSubject<any[]| null | undefined>} = {}
	@Input() verticalColsNumber: number = 2

	protected controller: EditItemController<T> | null = null; 
	
	constructor(
		protected d : ChangeDetectorRef,
		public u: UtilsService
	) {
	}

	ngOnInit(): void {
		if(!this.entityType || ! this.entityService || ! this.dialogService)
			throw new Error('Cannot instantiate the controller without entityType.');
		this.controller = new EditItemControllerWrapper<typeof this.entityType>(this.d,this.entityService,this.dialogService,this.u,this.cols, this.lists, this.subsetKey)
		this.controller.ngOnInit();
	}
}
