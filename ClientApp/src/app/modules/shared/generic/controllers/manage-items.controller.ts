import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { IdentificableItem } from '../models/IdentificableItem';
import { CrudService } from '../services/crud.service';
import { getFormGroupFromItemWithColumnSpecification } from '../helpers/tableColumn.helper';
import { ListItemsController } from './list-items.controller';
import { UtilsService } from '../../Utils';
import { BehaviorSubject, from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ReadonlyValidator, MinDateValidator, MaxDateValidator } from '../../models/componentModels';
import { Calendar } from 'primeng/calendar';
import * as moment from 'moment';


@Component({
	template: ''
})
export abstract class ManageItemsController<T extends IdentificableItem> extends ListItemsController<T> implements AfterViewInit {
	
	waitingResult = false;

	baseFormGroup: FormGroup = new FormGroup({
		items: this.fb.array([]), //the array of item instances
		
	})

	get itemsForm(): FormArray {
		return this.baseFormGroup.get("items") as FormArray;
	  }

	//used by the component to push other items
	overDataSource = new  BehaviorSubject<T[] | null | undefined>(undefined);

	@ViewChildren(Calendar) calendarComponents!: QueryList<Calendar>;
	
	 
	constructor(
		public es: CrudService<T>,
		public cs: ConfirmationService,
		private rt: Router,
		public fb: FormBuilder,
		public u: UtilsService,
		protected r: ActivatedRoute,
		private trans: TranslateService
	) {
		super(es,null,cs,rt,u,r,trans)
	 }
	ngAfterViewInit(): void {
		
		this.itemsForm.valueChanges.subscribe(v => { //TODO: too much overhead. Try to recalculate only the useful things
			var i = 0;
			for (let fg of this.itemsForm.controls){
				this.dynamicValidate(fg.getRawValue(),i)
				i++;
			}
		})	 
	}

	 override async ngOnInit(): Promise<void> {
		await super.ngOnInit();
		let sub = this.dataSource.subscribe(items => {
			this.overDataSource.next(items);
		})
		this.subscriptions.push(sub);

		let sub1 = this.overDataSource.subscribe(items => {
			let formArray = this.baseFormGroup.controls["items"] as FormArray;
			formArray.clear();
			if(items){
				let index = 0;
				for(var i of items){
					const itemForm = getFormGroupFromItemWithColumnSpecification(i, this.colsMap, this.emptyObject)//getFormGroupFromTableColumnsMap(this.colsMap);
					itemForm.patchValue(i);
					let potentialCode = (this.entityService.getFakeEntityObject() as any)["code"];
					if((i == null || Object.keys(i).length == 0) && potentialCode) { //it's a new element
						itemForm.controls["code"].setValue(potentialCode)
					}
					(this.baseFormGroup.controls["items"] as FormArray).push(itemForm);
					if(!i.uid) //it was a new fake record add.
						this.dt.initRowEdit(itemForm);
					this.dynamicValidate(itemForm.getRawValue(),index)
					index++;
				}
			}
		})
		this.subscriptions.push(sub1);
	}

	public canAddItem() : boolean{
		return !this.waitingData && (!this.itemsForm.controls || this.itemsForm.controls.length == 0 || this.itemsForm.controls[this.itemsForm.controls.length-1].value['uid'])
	}

	override getFieldIds() {
		return super.getFieldIds().map(field => "value." + field);
	}

	//Do not handle dialog case with this component.
	override editDialogClosed() {
		throw new Error('Method not implemented. Use ListItemsController if you prefer a dialog.');
	}

    async onRowEditSave(formGroup: FormGroup) {
		this.waitingResult = true;
		let item = formGroup.getRawValue();
		await this.saveItem(item);
		this.dt.cancelRowEdit(formGroup);
    }

	async saveItem(item: T){
		if(item.uid){
			try {
				let res = await this.entityService.editItem(item);
				this.msgs = [{ severity: 'success', summary: this.trans.instant("common.saved"), detail: this.trans.instant("common.itemSaved", {"code":(item as any)[this.labeledIdentifierField]})}]
				
			} catch (error) {
				console.error(error);
				this.msgs = [{ severity: 'error', summary: this.trans.instant("common.error"), detail: this.trans.instant("common.itemUpdateError", {"code":(item as any)[this.labeledIdentifierField]}) }]
			}
			finally{
				this.waitingResult = false;
			}
		}
		else{
			try {
				await this.entityService.createItem(item);
				this.msgs = [{ severity: 'success', summary: this.trans.instant("common.newItem"), detail: this.trans.instant("common.itemCreated") }]
				this.removeFakeItems();
			} catch (error) {
				console.error(error);
				this.msgs = [{ severity: 'error', summary: this.trans.instant("common.error"), detail: this.trans.instant("common.itemCreationError")}]
			}
			finally{
				this.waitingResult = false;
			}
		}
	}

    onRowEditCancel(formGroup: FormGroup) {
		let item = formGroup.getRawValue();
		//open the confirm dialog
		if(formGroup.touched){
			this.cs.confirm({
				message: this.trans.instant("common.editDialog"),
				header: this.trans.instant("common.editDialogHeader"),
				icon: 'pi pi-info-circle',
				accept: () => {
					if(!item.uid){
						this.overDataSource.value?.splice(this.overDataSource.value!.length-1,1);
						this.overDataSource.next(this.overDataSource.value);
						//N.B calling removeFakeItems it's the same but it will be O(n) and it's O(1) instead.
					}
					//reload elements:
					this.overDataSource.next(this.overDataSource.value);
					this.msgs = [{ severity: 'success', summary: this.trans.instant("common.itemRestored"), detail: this.trans.instant("common.itemRestoredDetail")}];
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

	public removeFakeItems(){
		var itemsWithoutFake = this.overDataSource.value?.filter(i => i.uid != undefined || i.uid != null);
		this.overDataSource.next(itemsWithoutFake);
	}

	override editClicked(item: T) {
		//TODO: understand if it is modifying every time the original object, since it is in the observable. i think no.
	}

	override addClicked() {
		this.overDataSource.next([...this.overDataSource.value ?? [],{} as T])
	}

	getFormGroupsForItems(items: T[]): FormGroup[]{
		if(items)
			return items.map(item => getFormGroupFromItemWithColumnSpecification(item,this.colsMap,this.entityService?.getFakeEntityObject()));
		else return [];
	}

	getNestedFormGroup(columnId: string, index: number){
		let array =  this.baseFormGroup.controls["items"] as FormArray 
		let val = array.controls[index].get(columnId) as FormGroup
		return val;	
	}

	protected dynamicValidate(item: any, index: number) {
		this.cols.filter(c=> c.dynamicValidatorsFunction).forEach(column => {
			let form = this.itemsForm.controls[index] as FormGroup;
			let validators = column.dynamicValidatorsFunction!(item);
			for(let validator of validators){
				if(validator instanceof ReadonlyValidator){
					if(validator.getValue() == true){
						if(form && form.controls[column.columnId])
							form.controls[column.columnId].disable({emitEvent:false, onlySelf: true}); //form is based on index, so the disable will be just for that index.
					}
					else {
						if(form && form.controls[column.columnId]){
							form.controls[column.columnId].enable({emitEvent:false, onlySelf: true});
						}
					}
				}
				if(validator instanceof MinDateValidator){ //only one calendar could exist at a time since we have only one row add. So the unique result will be the one to use. But it should work also for more calendars thanks to the index.
					let value = validator.getValue()
					let obs = this.calendarComponents.changes.subscribe(c => {
						let component = this.calendarComponents.find(c => c.el.nativeElement.id == column.columnId + "-" + index)
						if(component){
							component.minDate = value
							if(component.value){
								if(moment(component.value).isBefore(moment(value))){
									component.clear();
								}
							}
							obs.unsubscribe(); //avoid ram leak
						}
					})
				}
				if(validator instanceof MaxDateValidator){
					let value = validator.getValue()
					let obs = this.calendarComponents.changes.subscribe(c => {
						let component = this.calendarComponents.find(c => c.el.nativeElement.id == column.columnId + "-" + index)
						if(component){
							component.maxDate = value
							if(component.value){
								if(moment(component.value).isAfter(moment(value))){
									component.clear();
								}
							}
							obs.unsubscribe(); //avoid ram leak
						}
					})
				}

			}
		})
	}
}