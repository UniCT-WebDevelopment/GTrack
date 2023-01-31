import { Component, OnInit } from '@angular/core'
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { getAbsolutePathFromRelative } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { DetailsRoute, TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { TripsService } from '../../trips/trips.service';
import { RoleType, User } from '../models/user';
import { UsersService } from '../users.service';
import { UsersUtilsService } from '../users.utils.service';


@Component({
	selector: 'manage-Users',
	templateUrl: './manage.Users.component.html',
	styleUrls: ['./manage.Users.component.scss']
})
export class ManageUsersComponent implements OnInit{

	labeledIdentifierField: string = "uid";
	entityName: string = "User";
	entityTitle: string = this.translate.instant("users.entities");
	labeledTitle: string = this.translate.instant("users.entity")
	labeledDialogTitle: string = this.translate.instant("common.editItem", {entity:this.labeledTitle}); //TO-DO TRANSLATION
	entityType = {} as User
	showDetailDialog : boolean = false;
	lists: { [key: string]: BehaviorSubject<User[] | null | undefined> } = {}

	detailsRoutes  : DetailsRoute<User>[] = [
		{route: "changepassword" , filter: this.userUtils.getUserDynamicFilter(), icon: "pi pi-lock" } as DetailsRoute<User>
	]

	cols: TableColumn[] = [
		{
			displayName: this.translate.instant("common.name"),
			columnId: "name"
		},
		{
			displayName: this.translate.instant("common.surname"),
			columnId: "surname"
		},
		{
			displayName: "Email",
			columnId: "email"
		},
		{
			displayName: this.translate.instant("common.phoneNumber"),
			columnId: "phoneNumber",
			
		},
		{
			displayName: this.translate.instant("common.lastlogin"),
			columnId: "lastLogin",
			dataType: "none"
		},
		{
			displayName: this.translate.instant("common.lastlogout"),
			columnId: "lastLogout",
			dataType: "none"
		},
		{
			displayName: this.translate.instant("common.role"),
			columnId: "role",
			dataType: "comboBox",
			sourceListName : "roles",
			mappedKey: "value",
			validators: [Validators.required]
		},

	]

	editCols: TableColumn[] = [
		{
			displayName: this.translate.instant("common.role"),
			columnId: "role",
			dataType: "comboBox",
			sourceListName : "roles",
			mappedKey: "value",
			validators: [Validators.required]
		},
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
			displayName: "Email",
			columnId: "email",
			validators: [Validators.required, Validators.email]
		},
		{
			displayName: this.translate.instant("common.phoneNumber"),
			columnId: "phoneNumber",
			dataType: "phoneNumber",
			validators: [Validators.pattern('[- +()0-9]{6,}'),Validators.required]
		},
		{
			displayName: this.translate.instant("common.lastlogin"),
			columnId: "lastLogin",
			dataType: "none"
		},
		{
			displayName: this.translate.instant("common.lastlogout"),
			columnId: "lastLogout",
			dataType: "none"
		}
	]


	constructor(
		public es: UsersService,
		public ds: DialogService<User>,
		public dds: DetailsDialogService<User>,
		private cs: ConfirmationService,
		public r: Router,
		public utilsServ: UtilsService,
		public tripService: TripsService,
		public ar: ActivatedRoute,
		private translate: TranslateService, 
		private userUtils : UsersUtilsService,
	
	) {
		this.lists["roles"] = new BehaviorSubject<any[] | null | undefined>(this.utilsServ.enumToObjects(RoleType).map(e => ({...e, value :  this.translate.instant("roles.types."+ (e.value as string).toLowerCase())})));
	}
	ngOnInit(): void {
		this.dds.showDialog.subscribe(v => this.showDetailDialog = v ?? false);
	}

	dismissDetailsDialog(){
		let manageControllerUrl = getAbsolutePathFromRelative(this.r.url, "../../../");
		this.r.navigateByUrl(manageControllerUrl);
	}

}
