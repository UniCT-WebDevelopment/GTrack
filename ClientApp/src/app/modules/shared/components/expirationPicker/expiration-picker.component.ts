import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { UtilsService } from '../../Utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Expiration, PaymentType } from 'src/app/modules/content-modules/trips/models/models';
import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'expiration-picker',
	templateUrl: './expiration-picker.component.html',
	styleUrls: ['./expiration-picker.component.scss']
})
export class ExpirationPickerComponent implements OnInit{
	
	form : FormGroup = new FormGroup({		
		effectiveDate: new FormControl(null, Validators.required),
		cost: new FormControl(null, Validators.required),
		paymentMethod: new FormControl(null, Validators.required),
	})	

	@Input() formGroup?: FormGroup

	labeledExpirations: string = "";

	paymentOptions : any[]

	constructor(
		protected d : ChangeDetectorRef,
		public u: UtilsService,
		private translate: TranslateService
	) {
		this.paymentOptions = this.u.enumToObjects(PaymentType).map(e => ({...e, value :  this.translate.instant("paymentType."+ (e.value as string).toLowerCase())}))
	}

	ngOnInit(): void {
		if(!this.formGroup)
			throw new Error("Cannot use expiration picker without a formGroup.")
		this.form.patchValue(this.formGroup.getRawValue());
		
		this.getPickerValue();

	}

	onOverlayPanelOpen(){
		if(this.formGroup)
			this.form.patchValue(this.formGroup.getRawValue());
		this.getPickerValue();
	}
	
	
	saveChanges() {	
		if(!this.formGroup)
			throw new Error("Cannot use address picker without a formGroup.")
		let value = (this.form.getRawValue() as Expiration);
		this.formGroup.patchValue(this.form.getRawValue());
		this.formGroup.markAsTouched();
		this.getPickerValue();
	}


	getPickerValue() : string{
		let pickerValue = this.formGroup!.getRawValue() as Expiration;
		if(!this.u.isObjectEmpty(pickerValue)){
			this.labeledExpirations = this.u.getLabeledDate(pickerValue.effectiveDate)  + ", ";
			if(pickerValue.paymentMethod == "Cash"){
				this.labeledExpirations += this.translate.instant("paymentType.cash") + ", ";
			}
			else{
				this.labeledExpirations += this.translate.instant("paymentType.card") + ", ";
			}
			this.labeledExpirations += pickerValue.cost + " €"
			return this.labeledExpirations;
		}
		return ""
	}

	deleteForm() {
		this.formGroup?.reset();
		this.form?.reset();
	}

}
