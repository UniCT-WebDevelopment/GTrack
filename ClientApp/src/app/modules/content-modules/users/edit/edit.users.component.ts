import { Component } from '@angular/core'
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { TripsService } from '../../trips/trips.service';
import { RoleType, User } from '../models/user';
import { UsersService } from '../users.service';



@Component({
	selector: 'edit-users',
	templateUrl: './edit.Users.component.html',
	styleUrls: ['./edit.Users.component.scss']
})
export class EditUsersComponent{
	entityName: string = "User";
	entityType = {} as User;
	lists: { [key: string]: BehaviorSubject<User[] | null | undefined> } = {}
	
	cols: TableColumn[] = [
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
			editable: false, 
		},
		{
			displayName: this.translate.instant("common.lastLogout"),
			columnId: "lastLogout",
			editable: false
		}
	]


	constructor(
		public es: UsersService,
		public ds: DialogService<User>,
		private cs: ConfirmationService,
		public r: Router,
		public utilsServ: UtilsService,
		public tripService: TripsService,
		public ar: ActivatedRoute,
		private translate: TranslateService
	) {

		this.lists["roles"] = new BehaviorSubject<any[] | null | undefined>(this.utilsServ.enumToObjects(RoleType).map(e => ({...e, value :  this.translate.instant("roles.types."+ (e.value as string).toLowerCase())})));
		}

}
