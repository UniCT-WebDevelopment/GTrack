import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { UtilsService } from '../../Utils';
import { Form, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Address } from 'src/app/modules/content-modules/trips/models/models';
import { TableColumn } from '../../models/componentModels';
import { getFormGroupFromItemWithColumnSpecification } from '../../generic/helpers/tableColumn.helper';
import { BehaviorSubject } from 'rxjs';


@Component({
	selector: 'generic-picker',
	templateUrl: './generic-picker.component.html',
	styleUrls: ['./generic-picker.component.scss']
})
export class GenericPickerComponent implements OnInit{
	
	@Input() cols: TableColumn[] = [] //used for structure the internal form
	@Input() formGroup: FormGroup = new FormGroup({}); //used to put the value for the caller
	@Input() getLabeledValue?: (item: any) => string = () => {return ""}; 
	@Input() verticalColsNumber: number = 2;
	@Input() lists: {[key:string]: BehaviorSubject<any[]| null | undefined>} = {}
	private colsMap: Map<string, any> = new Map<string,any>();

	form : FormGroup = new FormGroup({}) //used for internal controls

	labeledValue: string = "";

	constructor(
		protected d : ChangeDetectorRef,
		public u: UtilsService
	) {}

	ngOnInit(): void {

		if(!this.cols || this.cols.length == 0 || !this.formGroup)
			throw new Error("Cannot use generic picker without columns.")
		this.colsMap = new Map(this.cols.map(e => ([e.columnId,e])));
		this.form = getFormGroupFromItemWithColumnSpecification(this.formGroup.getRawValue(),this.colsMap, {})
		if(this.getLabeledValue)
			this.getLabeledValue(this.form.getRawValue());

	}

	onOverlayPanelOpen(){
		this.form = getFormGroupFromItemWithColumnSpecification(this.formGroup.getRawValue(),this.colsMap, {})
		if(this.getLabeledValue)
			this.getLabeledValue(this.form.getRawValue());
	}
	
	
	saveChanges() {	
		if(!this.cols || this.cols.length == 0 || ! this.formGroup)
			throw new Error("Cannot use generic picker without columns and caller formGroup.")
		this.formGroup.patchValue(this.form.getRawValue())
		this.formGroup.markAsTouched(); //caller formGroup
		if(this.getLabeledValue)
			this.getLabeledValue(this.form.getRawValue());
	}

	deleteForm() {
		this.formGroup?.reset();
		this.form?.reset();
	}

	getLabeledValueInternal() : any{
		if(this.getLabeledValue)
			return this.getLabeledValue(this.form.getRawValue());
		return ""
	}

} 
