import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TableColumn } from 'src/app/modules/shared/models/componentModels';
import { UtilsService } from 'src/app/modules/shared/Utils';
import { TripsService } from '../../trips/trips.service';
import { DialogService } from 'src/app/modules/shared/generic/services/dialog.service';
import { BehaviorSubject } from 'rxjs';
import { allItemsSetKey } from 'src/app/modules/shared/GlobalConstants';
import { DeliveryService } from '../deliveries.service';
import { Delivery, DeliveryStateLog } from '../models/delivery';
import { GetFilterKeyFromRoute } from 'src/app/modules/shared/generic/helpers/routing.helper';
import { StagesService } from '../../trips/stages.service';
import { Package } from '../../warehouse/models/package';
import { getFilterForEntity, getFilterFromKey, getFilterKey } from 'src/app/modules/shared/generic/filters/filters.helper';
import { DynamicPropertyFilter, EntityFilterOperator, PropertyFilter } from 'src/app/modules/shared/generic/filters/filtering/PropertyFilter';
import { TranslateService } from '@ngx-translate/core';
import { NestedTableItem, TableItem } from 'src/app/modules/shared/components/nestedTable/models';
import { DeliveryStateLogsService } from '../deliveryStateLogs.service';
import { CustomerUtilsService } from '../customer.utils.service';
import { TripsUtilsService } from '../../trips/trips.utils.service';
import { DynamicMappingList } from 'src/app/modules/shared/generic/mapping/models';
import { CustomersService } from '../customers.service';



@Component({
	selector: 'details-customers',
	templateUrl: './details.Customers.component.html',
	styleUrls: ['./details.Customers.component.scss']
})
export class DetailsCustomersComponent{
	labeledIdentifierField: string = "uid";
	entityName: string = "Delivery"
	entityType = {} as Delivery;
	subsetKey = allItemsSetKey

	cols: TableColumn[] = [
		{
			displayName: this.translate.instant("customer.dialog.deliveryType"),
			columnId: "deliveryType"
		},
		{
			displayName: "Mittente", //TODO: transalate
			columnId: "sender",
			sourceListName: "customers",
			mappedKey: "businessName"
		},
		{
			displayName: this.translate.instant("customer.dialog.inboundTrip"),
			columnId: "inboundTripCode",
			calculatedRouterLink: (item: Delivery) => {
				return "/admin/trips/trip/edit/" + item.inboundTrip;
			}
		},
		{
			displayName: this.translate.instant("customer.dialog.inboundStage"),
			columnId: "inboundStageCode",
			calculatedRouterLink: (item: Delivery) => {
				if (item.inboundTrip) {
					let filterKey = getFilterKey(new PropertyFilter("trip", item.inboundTrip))
					return "/admin/trips/stage/edit/" + filterKey;
				}
				return null;
			}
		},
		{
			displayName: this.translate.instant("customer.dialog.inboundDate"),
			columnId: "inboundDate",
		},
		{
			displayName: "Destinatario", //TODO: transalate
			columnId: "recipient",
			sourceListName: "customers",
			mappedKey: "businessName"
		},
		{
			displayName: this.translate.instant("customer.dialog.outboundTrip"),
			columnId: "outboundTripCode",
			calculatedRouterLink: (item: Delivery) => {
				return "/admin/trips/trip/edit/" + item.outboundTrip;
			}
		},
		{
			displayName: this.translate.instant("customer.dialog.outboundStage"),
			columnId: "outboundStageCode",
			calculatedRouterLink: (item: Delivery) => {
				if (item.outboundTrip) {
					let filterKey = getFilterKey(new PropertyFilter("trip", item.outboundTrip))
					return "/admin/trips/stage/edit/" + filterKey;
				}
				return null;
			}

		},
		{
			displayName: this.translate.instant("customer.dialog.outboundDate"),
			columnId: "outboundDate",
		},
		{
			displayName: this.translate.instant("packages.entities"),
			columnId: "packages",
		}
	]

	logsCols: TableColumn[] = [
		{
			displayName: this.translate.instant("customer.dialog.deliveryState"),
			columnId: "state"
		},
		{
			displayName: this.translate.instant("common.date"),
			columnId: "date",
			dataType: "date"
		}
	]

	lists: { [key: string]: BehaviorSubject<any[] | null | undefined> } = {}
	rootTableItem: TableItem<Delivery, DeliveryStateLog>;
	nestedItem: NestedTableItem<DeliveryStateLog>;

	constructor(
		public es: DeliveryService,
		public logsService: DeliveryStateLogsService,
		public ds: DialogService<Delivery>,
		private cs: ConfirmationService,
		public r: Router,
		public utilsServ: UtilsService,
		public ar: ActivatedRoute,
		public ts: TripsService,
		public tripUtils: TripsUtilsService,
		public st: StagesService,
		public translate: TranslateService, 
		public custUtilsServ: CustomerUtilsService,
		public customerService: CustomersService
	) {
		
		this.subsetKey = GetFilterKeyFromRoute(this.es.getFakeEntityObject(), this.ar.snapshot);
		this.nestedItem = {
			cols: this.logsCols,
			entityName: this.entityName,
			labeledEntityName: "Logs",
			labeledDialogTitle: "Logs",
			children: null,
			entityService: this.logsService,
			dialogService: null,
			labeledIdentifierField: "code",
			entityType: {} as DeliveryStateLog,
			showDatesPaginator: false,
			initFilters: []
		}
		this.rootTableItem = {
			cols: this.cols,
			entityName: "Delivery",
			labeledEntityName: "Delivery",
			labeledDialogTitle: "Delivery",
			children: this.nestedItem,
			entityService: this.es,
			dialogService: this.ds,
			labeledIdentifierField: "uid",
			entityType: {} as Delivery,
			initFilters: [],
			subsetKey: this.subsetKey,
			childPropertyFilter: new DynamicPropertyFilter<Delivery, string>("delivery", "uid"),
			mappingLists: this.lists,
			showDatesPaginator: true,
			dateFilteringPropertyKey: "inboundDate"
		}
		
		this.lists["customers"] = this.customerService.items[allItemsSetKey];
		
	}
}
