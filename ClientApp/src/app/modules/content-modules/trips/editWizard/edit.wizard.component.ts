import { Component, OnInit} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

@Component({
	selector: 'edit-wizard',
	templateUrl: './edit.wizard.component.html',
	styleUrls: ['./edit.wizard.component.scss']
})
export class EditWizardComponent implements OnInit {

	items: MenuItem[] = []

	ngOnInit(): void {
		this.items = [
            {routerLink: 'trip', label: this.translate.instant('trips.tripData'), icon: 'pi pi-fw pi-home'},
            {routerLink: 'stage', label: this.translate.instant('trips.stages.entities'), icon: 'pi pi-fw pi-calendar'},
            {routerLink: 'cost',label: this.translate.instant('trips.costs.entities'), icon: 'pi pi-fw pi-file'},
        ];
	}

	constructor(private router: Router, private route: ActivatedRoute, private translate: TranslateService){}
}
