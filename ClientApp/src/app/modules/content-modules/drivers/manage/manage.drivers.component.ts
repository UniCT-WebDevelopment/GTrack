import { Component, OnInit } from '@angular/core'
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { ListItemsController } from 'src/app/modules/shared/generic/controllers/list-items.controller';
import { getAbsolutePathFromRelative } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { DetailsRoute, TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { Customer } from '../../customers/models/customer';
import { DriversService } from '../drivers.service';
import { DriverUtilsService } from '../drivers.utils.service';
import { Driver } from '../models/driver';

@Component({
	selector: 'manage-drivers',
	templateUrl: './manage.drivers.component.html',
	styleUrls: ['./manage.drivers.component.scss']
})
export class ManageDriversComponent implements OnInit{	
	labeledIdentifierField: string = "email";
	entityName: string = "Driver";
	labeledTitle: string = this.translate.instant("drivers.entity")
	labeledDialogTitle: string = this.translate.instant("common.editItem", {entity:this.labeledTitle});
	labeledEntityName: string = this.translate.instant("drivers.entities"); 

	entityType = {} as Driver 

	cols: TableColumn[] = [ 
		{
			displayName: this.translate.instant("common.name") ,
		 	columnId: "name", 
			validators: [Validators.required]
		},
		{
			displayName: this.translate.instant("common.surname") ,
		 	columnId: "surname", 
			 validators: [Validators.required]
		},
		{
			displayName: "Email" ,
		 	columnId: "email",
			validators: [Validators.email, Validators.required] 
		},
		{
			displayName: this.translate.instant("common.phoneNumber") ,
		 	columnId: "phoneNumber",
			dataType: "phoneNumber",
			validators: [Validators.pattern('[- +()0-9]+'),Validators.required]
		}
		]

	showDetailDialog = false;
	
	editCols: TableColumn[] = [ 
		{
			displayName:  this.translate.instant("common.name"),
			columnId: "name",
			validators: [Validators.required]

		},
		{
			displayName: this.translate.instant("common.surname") ,
			columnId: "surname", 
			validators: [Validators.required] 
		},
		{
			displayName: "Email" ,
			columnId: "email",
			validators: [Validators.required, Validators.email] 
		},
		{
			displayName: this.translate.instant("common.phoneNumber") ,
			columnId: "phoneNumber", 
			dataType: "phoneNumber",
			validators: [Validators.pattern('[- +()0-9]{6,}'),Validators.required]
		}
		]

	detailsRoutes  : DetailsRoute<Driver>[] = [
		{route: "details" , filter: this.driUtilsServ.getDriverTrips()} as DetailsRoute<Driver>
	]

	constructor(
		public es : DriversService,
		public ds : DialogService<Driver>,
		private cs : ConfirmationService,
		public r: Router,
		public utilsServ : UtilsService,
		protected arou: ActivatedRoute,
		private translate: TranslateService,
		public dds: DetailsDialogService<Driver>,
		public driUtilsServ: DriverUtilsService
	) {
	}

	ngOnInit(): void {
		this.dds.showDialog.subscribe(v => this.showDetailDialog = v ?? false);
	}

	dismissDetailsDialog(){
		let manageControllerUrl = getAbsolutePathFromRelative(this.r.url, "../../../");
		this.r.navigateByUrl(manageControllerUrl);
	}

}
