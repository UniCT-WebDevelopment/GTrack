import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { DetailsRoute, TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { TripsService } from '../../trips/trips.service';
import { Customer } from '../models/customer';
import { CustomersService } from '../customers.service';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';
import { getAbsolutePathFromRelative } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { allItemsSetKey } from 'src/app/modules/shared/GlobalConstants';
import { TranslateService } from '@ngx-translate/core';
import { Validators } from '@angular/forms';
import { CustomerUtilsService } from '../customer.utils.service';


@Component({
	selector: 'manage-Customers',
	templateUrl: './manage.Customers.component.html',
	styleUrls: ['./manage.Customers.component.scss']
})
export class ManageCustomersComponent implements OnInit{

	labeledIdentifierField: string = "uid";
	entityName: string = "Customer";
	entityTitle: string = this.translate.instant("customer.entities");
	dialogTitle: string = this.translate.instant("customer.entity");
	entityType = {} as Customer;
	subsetKey = allItemsSetKey;
	//deliveriesByCustomerFilter = new DynamicPropertyFilter<Customer,string>("customer", "uid");

	cols: TableColumn[] = [
		{
			displayName: this.translate.instant("common.name"),
			columnId: "name",
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("common.surname"),
			columnId: "surname",
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("common.businessName"),
			columnId: "businessName",
			validators: [Validators.required]
		},
		{
			displayName: "Email",
			columnId: "email",
			validators: [Validators.required, Validators.email]
		},
		{
			displayName: this.translate.instant("common.phoneNumber"),
			columnId: "phoneNumber",
			dataType: "phoneNumber",
			validators: [Validators.required, Validators.pattern('[- +()0-9]{6,}')]
		},
		{
			displayName: this.translate.instant("common.address"),
			columnId: "address",
			dataType: "address",
			validators: [Validators.required],
			calculationFunction: (item: Customer) => {
				let addressEmpty = this.utilsServ.isObjectEmpty(item.address)
				if(!addressEmpty){
					let address = item.address?.streetName + ", " + item.address?.streetNumber + ", " + item.address?.city + ", " + item.address?.postalCode 
					+ ", " + item.address?.region + ", " + item.address?.state
					return address;
				}
				else{
					return "";
				}
			}
		}
	]

	showDetailDialog = false;

	detailsRoutes  : DetailsRoute<Customer>[] = [
		{route: "details" , filter: this.cusUtilsServ.getDeliveriesOfCurrentMonthDynamicFilter()} as DetailsRoute<Customer>
	]

	constructor(
		public es: CustomersService,
		public ds: DialogService<Customer>,
		private cs: ConfirmationService,
		public r: Router,
		public utilsServ: UtilsService,
		public tripService: TripsService,
		public ar: ActivatedRoute,
		public translate: TranslateService,
		public dds: DetailsDialogService<Customer>,
		public cusUtilsServ: CustomerUtilsService
	) {	}
	
	ngOnInit(): void {
		this.dds.showDialog.subscribe(v => this.showDetailDialog = v ?? false);

	}

	dismissDetailsDialog(){
		let manageControllerUrl = getAbsolutePathFromRelative(this.r.url, "../../../");
		this.r.navigateByUrl(manageControllerUrl);
	}


	
}
