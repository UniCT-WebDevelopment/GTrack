import { Component, OnInit } from '@angular/core'
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Md5 } from 'md5-typescript';
import { ConfirmationService } from 'primeng/api';
import { ApiAuthService } from 'src/app/modules/auth/auth.service.api';
import { getFilterValue } from 'src/app/modules/shared/generic/filters/filters.helper';
import { getAbsolutePathFromRelative, GetFilterFromRoute } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { DetailsDialogService } from 'src/app/modules/shared/generic/services/details-dialog.service';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { TripsService } from '../../trips/trips.service';
import { User } from '../models/user';
import { UsersService } from '../users.service';



@Component({
	selector: 'change-password',
	templateUrl: './change.password.component.html',
	styleUrls: ['./change.password.component.scss']
})
export class ChangePasswordComponent implements OnInit{
	entityType = {} as User;
	currentUser : User|undefined

	waitingResult = false;
	inputPsw : string = "";
	inputRepeatPsw : string = "";

	constructor(
		public es: UsersService,
		public ds: DialogService<User>,
		public dss: DetailsDialogService<User>,
		private cs: ConfirmationService,
		public r: Router,
		public utilsServ: UtilsService,
		public tripService: TripsService,
		public ar: ActivatedRoute,
		private userServ: UsersService,
		private authServ: ApiAuthService
	) {	}

	async ngOnInit(): Promise<void> {
		console.log("opened")
		let filter = GetFilterFromRoute(this.es.getFakeEntityObject(),this.ar.snapshot)
		if(!filter)
			throw new Error("Cannot find the routing filter")
		let userId = getFilterValue("uid", filter);
		if(!userId) 
			throw new Error("Cannot find the userId from filter")
		let user = await this.userServ.getItem({uid: userId} as User);
		if(!user)
			throw new Error("Cannot find the specified user") 
		this.currentUser = user;
	}

	saveClicked(){
		this.waitingResult = true;
		if(this.inputPsw){
			this.changePassword(this.inputPsw).then(r => this.waitingResult = false).then(r=> this.dismissDialog())
		}
			
		else 
			throw new Error("Cannot put empty password")
	}

	async changePassword(newPsw: string) : Promise<boolean> {
		let user = {...this.currentUser!, password: newPsw}
		return this.userServ.updatePassword(user);
	}

	dismissDialog(){
		this.dss.showDialog.next(false);
		let manageControllerUrl = getAbsolutePathFromRelative(this.r.url, "../../../");
		this.r.navigateByUrl(manageControllerUrl);
	}

}
