import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core'
import { UtilsService } from '../../Utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/modules/content-modules/customers/customers.service';
import { Customer } from 'src/app/modules/content-modules/customers/models/customer';

@Component({
	selector: 'customer-picker',
	templateUrl: './customer-picker.component.html',
	styleUrls: ['./customer-picker.component.scss']
})
export class CustomerPickerComponent implements OnInit{
	
	form : FormGroup = new FormGroup({		
		name: new FormControl(null, Validators.required),	
		surname: new FormControl(null, Validators.required),
		email: new FormControl(null, [Validators.required, Validators.email]),
		phoneNumber: new FormControl(null, [Validators.required, Validators.pattern('[- +()0-9]{6,}')])
	})	

	waitingResult = false;
	labeledEmail: string = "";

	@Output() onCustomerCreated = new EventEmitter<Customer>()

	constructor(
		protected d : ChangeDetectorRef,
		public u: UtilsService,
		private cs: CustomersService

	) {}

	ngOnInit(): void {
		
	}
	
	saveChanges()  {	
		this.waitingResult = true;
		let value = (this.form.getRawValue() as Customer);
		delete value.address;
		this.form.markAsTouched();
		this.cs.createItem(value).then(result => {
			if (result) {
				this.onCustomerCreated.emit(result)
				this.waitingResult = false;
			}
		})
	}

}
