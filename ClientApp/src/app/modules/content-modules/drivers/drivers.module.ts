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
import { ManageDriversComponent } from './manage/manage.drivers.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { DriversRoutingModule } from './drivers-routing.module';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import {InputNumberModule} from 'primeng/inputnumber';
import { DetailsDriversComponent } from './dialog/details.drivers.component';
import { SharedModule } from '../../shared/components/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from 'src/app/app.module';


@NgModule({
  declarations: [
    ManageDriversComponent,
    DetailsDriversComponent
  ],
  imports: [
    DriversRoutingModule,
    CommonModule,
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
    TranslateModule,
    TooltipModule,
    InputNumberModule,
    SharedModule,
    HttpClientModule
  ],
  bootstrap: [ManageDriversComponent],
  providers: [ConfirmationService],
})
export class DriversModule { }
