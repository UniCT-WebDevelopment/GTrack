import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject, Subject } from 'rxjs';
import { LocalTableFilter, TableColumn } from 'src/app/modules/shared/models/componentModels';
import { allItemsSetKey } from '../../GlobalConstants';
import { UtilsService } from '../../Utils';
import { ListItemsController } from '../controllers/list-items.controller';
import { DynamicMapping } from '../mapping/models';
import { IdentificableItem } from '../models/IdentificableItem';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';


export class ListItemsControllerWrapper<T extends IdentificableItem> extends ListItemsController<T> {
	entityName: string;
	labeledIdentifierField: string;
	labeledEntityName: string;
	labeledDialogTitle: string;
	cols: TableColumn[];
	useRouting = false;


	constructor(
		public e: CrudService<T>,
		public d: DialogService<T> | null,
		private c: ConfirmationService,
		private r: Router,
		public u: UtilsService,
		protected ar: ActivatedRoute,
		private translate: TranslateService,
		entityName: string,
		labeledIdentifierField : string,
		entityLabeledTitle: string,
		labeledDialogTitle: string, //TO-DO TRANSLATION 
		cols: TableColumn[],
		lists: {[key:string]: BehaviorSubject<any[] | null | undefined>},
		subsetKey: string = allItemsSetKey,
		initFilters: LocalTableFilter[] = [],
		useRoutingForEdit = false,
		selectedDate? : Date ,
		dateFilteringPropertyKey? : string,
		dynamicMappings : DynamicMapping<any>[]|null = null
		
	) {
		super(e,d,c,r,u,ar,translate);
		this.entityName = entityName;
		this.labeledIdentifierField = labeledIdentifierField;
		this.labeledEntityName = entityLabeledTitle;
		this.labeledDialogTitle = labeledDialogTitle;
		this.cols = cols;
		this.lists = lists;
		this.subsetKey = subsetKey;
		if(!e.items[subsetKey]) e.items[subsetKey] = new BehaviorSubject<T[] | undefined | null>(undefined);
		this.initFilters = initFilters;
		this.useRouting = useRoutingForEdit
		if(selectedDate)
			this.selectedDate = selectedDate ;
		if(dateFilteringPropertyKey)
			this.dateFilteringPropertyKey = dateFilteringPropertyKey;
		this.dynamicMappings = dynamicMappings
	}

	override editClicked(item: T): void {
		super.editClicked(item);
		//in this case we know that we are not using routing, so execute the same resolvers actions
		//in order to make edit item component works properly.
		if(!this.useRouting){
			this.e.item.next(undefined); //start loading
			this.e.getItem({ uid: item.uid } as T).then(res => { });
			if(this.d)
				this.d.showDialog.next(true);
		}
	}

	override addClicked(): void {
		super.addClicked();
		//in this case we know that we are not using routing, so execute the same resolvers actions
		//in order to make edit item component works properly.
		if(!this.useRouting){
			this.e.item.next(null);
			if(this.d)
				this.d.showDialog.next(true);
		}
	}

	override editDialogClosed(){
		if(this.useRouting){
			super.editDialogClosed();
		}
		//do nothing cause routing is not used here.
	}
}