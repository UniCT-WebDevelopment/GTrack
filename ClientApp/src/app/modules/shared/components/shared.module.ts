import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';
import {CheckboxModule} from 'primeng/checkbox';
import { DividerModule } from "primeng/divider";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { NestedTableComponent } from './nestedTable/nested-table.component';
import { ListItemsComponent } from './listItems/list-items.component';
import { EditItemComponent } from './editItem/edit.item.component';
import {CalendarModule} from 'primeng/calendar';
import {InputNumberModule} from 'primeng/inputnumber';
import { RouterModule } from '@angular/router';
import { DatePaginatorComponent } from './datePaginator/datepaginator.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AddressPickerComponent } from './addressPicker/address-picker.component';
import { ItemsPaginatorComponent } from './itemsPaginator/itemspaginator.component';
import { CustomerPickerComponent } from './customerPicker/customer-picker.component';
import { ExpirationPickerComponent } from './expirationPicker/expiration-picker.component';
import { ManageItemsComponent } from './manageItems/manage-items.component';
import { FileUploadModule } from 'primeng/fileupload';
import { GenericPickerComponent } from './genericPicker/generic-picker.component';


@NgModule({
  declarations: [
    ListItemsComponent,
    EditItemComponent,
    ManageItemsComponent,
    NestedTableComponent,
    AddressPickerComponent,
    ExpirationPickerComponent,
    CustomerPickerComponent,
    DatePaginatorComponent,
    ItemsPaginatorComponent,
    GenericPickerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    InputTextModule,
    BadgeModule,
    RippleModule,
    StyleClassModule,
    SelectButtonModule,
    ButtonModule,
    AccordionModule,
    CheckboxModule,
    DividerModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputSwitchModule,
    TableModule,
    MultiSelectModule,
    MessagesModule,
    ConfirmDialogModule,
    DialogModule,
    ProgressSpinnerModule,
    CalendarModule,
    InputNumberModule,
    TranslateModule,
    TooltipModule,
    OverlayPanelModule,
    InputTextModule,
    FileUploadModule
  ],
  providers: [ConfirmationService],
  exports : [
    ListItemsComponent,
    EditItemComponent,
    ManageItemsComponent,
    NestedTableComponent,
    AddressPickerComponent,
    DatePaginatorComponent,
    ItemsPaginatorComponent,
    CustomerPickerComponent,
    ExpirationPickerComponent,
    GenericPickerComponent
  ]
})
export class SharedModule { }
