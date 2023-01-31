import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { LocalTableFilter, TableColumn } from 'src/app/modules/shared/models/componentModels';
import { allItemsSetKey } from '../../GlobalConstants';
import { UtilsService } from '../../Utils';
import { ListItemsController } from '../controllers/list-items.controller';
import { ManageItemsController } from '../controllers/manage-items.controller';
import { DynamicMapping } from '../mapping/models';
import { IdentificableItem } from '../models/IdentificableItem';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';


export class ManageItemsControllerWrapper<T extends IdentificableItem> extends ManageItemsController<T> {
	entityName: string;
	labeledIdentifierField: string;
	labeledEntityName: string;
	labeledDialogTitle: string;
	cols: TableColumn[];

	constructor(
		public  e: CrudService<T>,
		public d: DialogService<T> | null,
		private rout : Router,
		private c: ConfirmationService,
		public f: FormBuilder,
		public util: UtilsService,
		private aro: ActivatedRoute,
		private translate: TranslateService,
		entityName: string,
		labeledIdentifierField : string,
		entityLabeledTitle: string,
		labeledDialogTitle: string, //TO-DO TRANSLATION 
		cols: TableColumn[],
		lists: {[key:string]: BehaviorSubject<any[] | null | undefined>},
		subsetKey: string = allItemsSetKey,
		initFilters: LocalTableFilter[] = [],
		selectedDate? : Date ,
		dateFilteringPropertyKey? : string,
		dynamicMappings : DynamicMapping<any>[]|null = null
		
	) {
		super(e, c, rout, f, util, aro, translate);
		this.entityName = entityName;
		this.labeledIdentifierField = labeledIdentifierField;
		this.labeledEntityName = entityLabeledTitle;
		this.labeledDialogTitle = labeledDialogTitle;
		this.cols = cols;
		this.lists = lists;
		this.subsetKey = subsetKey;
		if(!e.items[subsetKey]) e.items[subsetKey] = new BehaviorSubject<T[] | undefined | null>(undefined);
		this.initFilters = initFilters;
		if(selectedDate)
			this.selectedDate = selectedDate ;
		if(dateFilteringPropertyKey)
			this.dateFilteringPropertyKey = dateFilteringPropertyKey;
		this.dynamicMappings = dynamicMappings;
	}



	public override canAddItem() : boolean{
		return !this.waitingData && (!this.itemsForm.controls || this.itemsForm.controls.length == 0 || this.itemsForm.controls[this.itemsForm.controls.length-1].value['uid'])
	}

	override async onRowEditSave(formGroup: FormGroup) {
		this.waitingResult = true;
		let item = formGroup.value;
		await this.saveItem(item);
		this.dt.cancelRowEdit(formGroup);
    }

	override async saveItem(item: T){
		if(item.uid){
			try {
				let res = await this.entityService.editItem(item);
				this.msgs = [{ severity: 'success', summary: this.translate.instant("common.saved"), detail: this.translate.instant("common.itemSaved", {"code":(item as any)[this.labeledIdentifierField]})}]
				
			} catch (error) {
				console.error(error);
				this.msgs = [{ severity: 'error', summary: this.translate.instant("common.error"), detail: this.translate.instant("common.itemUpdateError", {"code":(item as any)[this.labeledIdentifierField]}) }]
			}
			finally{
				this.waitingResult = false;
			}
		}
		else{
			try {
				await this.entityService.createItem(item);
				this.msgs = [{ severity: 'success', summary: this.translate.instant("common.newItem"), detail: this.translate.instant("common.itemCreated") }]
				this.removeFakeItems();
			} catch (error) {
				console.error(error);
				this.msgs = [{ severity: 'error', summary: this.translate.instant("common.error"), detail: this.translate.instant("common.itemCreationError")}]
			}
			finally{
				this.waitingResult = false;
			}
		}
	}

    override onRowEditCancel(formGroup: FormGroup) {
		let item = formGroup.value;
		//open the confirm dialog
		if(formGroup.touched){
			this.cs.confirm({
				message: this.translate.instant("common.editDialog"),
				header: this.translate.instant("common.editDialogHeader"),
				icon: 'pi pi-info-circle',
				accept: () => {
					if(!item.uid){
						this.overDataSource.value?.splice(this.overDataSource.value!.length-1,1);
						this.overDataSource.next(this.overDataSource.value);
						//N.B calling removeFakeItems it's the same but it will be O(n) and it's O(1) instead.
					}
					//reload elements:
					this.overDataSource.next(this.overDataSource.value);
					this.msgs = [{ severity: 'success', summary: this.translate.instant("common.itemRestored"), detail: this.translate.instant("common.itemRestoredDetail")}];
					this.dt.cancelRowEdit(formGroup);
				},
				reject: () => {},
				key: "positionDialog"
			});
		}
		else{
			if(!item.uid){
				this.overDataSource.value?.splice(this.overDataSource.value!.length-1,1);
				this.overDataSource.next(this.overDataSource.value);
				//N.B calling removeFakeItems it's the same but it will be O(n) and it's O(1) instead.
			}
			//reload elements:
			this.overDataSource.next(this.overDataSource.value);
			this.dt.cancelRowEdit(formGroup);
		}
    }

}