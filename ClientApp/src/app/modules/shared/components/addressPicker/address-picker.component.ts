import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { UtilsService } from '../../Utils';
import { Form, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Address } from 'src/app/modules/content-modules/trips/models/models';


@Component({
	selector: 'address-picker',
	templateUrl: './address-picker.component.html',
	styleUrls: ['./address-picker.component.scss']
})
export class AddressPickerComponent implements OnInit{
	
	form : FormGroup = new FormGroup({		
		streetName: new FormControl(null, Validators.required),	
		streetNumber: new FormControl(null, Validators.required),
		city: new FormControl(null, Validators.required),
		postalCode: new FormControl(null, Validators.required),
		region: new FormControl(null, Validators.required),
		state: new FormControl(null, Validators.required),
	})	

	@Input() formGroup?: FormGroup

	labeledAddress: string = "";

	constructor(
		protected d : ChangeDetectorRef,
		public u: UtilsService
	) {}

	ngOnInit(): void {
		if(!this.formGroup)
			throw new Error("Cannot use address picker without a formGroup.")
		this.form.patchValue(this.formGroup.getRawValue());

		this.getLabeledAddress();

	}

	onOverlayPanelOpen(){
		if(this.formGroup)
			this.form.patchValue(this.formGroup.getRawValue());
		this.getLabeledAddress();
	}
	
	
	saveChanges() {	
		if(!this.formGroup)
			throw new Error("Cannot use address picker without a formGroup.")
		let value = (this.form.getRawValue() as Address);
		this.formGroup.patchValue(this.form.getRawValue());
		this.formGroup.markAsTouched();
		this.getLabeledAddress();
	}


	getLabeledAddress() : string{
		let addressObj = this.formGroup!.getRawValue() as Address;
		if(!this.u.isObjectEmpty(addressObj)){
			this.labeledAddress = addressObj.streetName + ", " + addressObj.streetNumber + ", " + addressObj.city + ", " 
								+ addressObj.postalCode + ", " + addressObj.region + ", " + addressObj.state;					
			return this.labeledAddress;
		}
		return ""
	}

	deleteForm() {
		this.formGroup?.reset();
		this.form?.reset();
	}

}
