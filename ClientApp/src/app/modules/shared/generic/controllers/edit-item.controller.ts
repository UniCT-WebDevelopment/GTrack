import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { allItemsSetKey } from '../../GlobalConstants';
import { MaxDateValidator, MinDateValidator, ReadonlyValidator, TableColumn } from '../../models/componentModels';
import { UtilsService } from '../../Utils';
import { IdentificableItem } from '../models/IdentificableItem';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';
import { getFormGroupFromTableColumnsMap } from '../helpers/tableColumn.helper';
import { EntityMappingController } from './entity-mapping.controller';
import { nanoid } from 'nanoid';
import { Calendar } from 'primeng/calendar';
import * as moment from 'moment';

@Component({
	template: ''
})
export abstract class EditItemController<T extends IdentificableItem> extends EntityMappingController<T> implements OnInit, OnDestroy, AfterViewInit {
	subsetKey: string = allItemsSetKey
	form : FormGroup = new FormGroup({});

	_item? : T|null
	waitingResult = false;
	waitingData = false;
	subscription? : Subscription
	abstract override cols: TableColumn[];
	override emptyObject: T;

	@ViewChildren(Calendar) calendarComponents!: QueryList<Calendar>;
	

	constructor(
		private ch : ChangeDetectorRef,
		private entityService: CrudService<T>,
		private dialogService: DialogService<T>,
		public uss: UtilsService
	) {
		super(uss);
		this.emptyObject = this.entityService.getFakeEntityObject();
	 }
	ngAfterViewInit(): void {
		//when the form value changes, recalculate validators
		this.form.valueChanges.subscribe(v =>  this.dynamicValidate(v as T))
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
		this.subscription = undefined;
	}

	override ngOnInit(): void {
		super.ngOnInit();
		//construct the form from tablecolumns:
		this.form = getFormGroupFromTableColumnsMap(this.entityService.getFakeEntityObject(), this.colsMap);

		

		this.waitingData = true;
		this.subscription = this.entityService.item.subscribe(t => {
			if(t !== undefined){ //undefined means we are still waiting for data. 
				this.form.reset();
				this.waitingData = false;
				this._item = t;
				if(t !== null) //null means there is no data, element not found. 
					this.form.patchValue(t);
				let potentialCode = (this.entityService.getFakeEntityObject() as any)["code"];
				if(this._item == null && potentialCode) { //it's a new element
					this.form.controls["code"].setValue(potentialCode)
				}
				for(let key in this.form.controls){ //handle immutable props
					let column = this.colsMap.get(key);
					if(column && column.immutableIfDefined && this.form.controls[key].value){
						this.form.controls[column.columnId].disable();
					}
				}
			}
			else{
				this.waitingData = true;
			}
		})
	}

	protected dynamicValidate(item: T) {
		this.cols.filter(c=> c.dynamicValidatorsFunction).forEach(column => {
			let validators = column.dynamicValidatorsFunction!(item);
			for(let validator of validators){
				if(validator instanceof ReadonlyValidator){
					if(validator.getValue() == true)
						this.form.controls[column.columnId].disable();
					else 
						this.form.controls[column.columnId].enable();
				}
				if(validator instanceof MinDateValidator){
					let value = validator.getValue()
					let component = this.calendarComponents.find(c => c.el.nativeElement.id == column.columnId)
					if(component){
						component.minDate = value
						if(component.value){
							if(moment(component.value).isBefore(moment(value))){
								component.clear();
							}
						}
					}
					else{
						console.warn("Cannot find calendar component")
					}
				}
				if(validator instanceof MaxDateValidator){
					let value = validator.getValue()
					let component = this.calendarComponents.find(c => c.el.nativeElement.id == column.columnId)
					if(component){
						component.maxDate = value
						if(component.value){
							if(moment(component.value).isAfter(moment(value))){
								component.clear();
							}
						}
					}
					else{
						console.warn("Cannot find calendar component")
					}
				}

			}
		})
	}

	public getEditableColumns(): TableColumn[] {
		return this.cols.filter(c => !c.dataType || c.dataType != 'none');
	}

	public saveChanges(closeDialog: boolean = false): Observable<boolean>{
		let result = new Subject<boolean>();
		//we are sure to have data thanks to the validators -> force conversion to T
		var item = {...this._item, ...this.form.getRawValue()} as T
		this.waitingResult = true;
		if(!item.uid){
			this.entityService.createItem(item).then(r => {
				this.waitingResult = false;
				this.waitingData = true;
				this.dialogService.onItemSave.next(r);
				if(closeDialog) this.dialogService.showDialog.next(false);
				result.next(true);
				result.complete();
				
			}).catch((error:Error) => {
					console.error(error)
					result.next(false);
					result.complete();
			})
		}
		else
			this.entityService.editItem(item).then(r => {
					this.waitingResult = false;
					this.waitingData = true;
					this.dialogService.onItemSave.next(item);
					if(closeDialog) this.dialogService.showDialog.next(false);
					result.next(true);
					result.complete();
			}).catch((error:Error) => {
					console.error(error)
					result.next(false);
					result.complete();
			})
		return result;
	}


	getNestedFormGroup(columnId: string, ){
		return this.form.controls[columnId] as FormGroup
	}
}
