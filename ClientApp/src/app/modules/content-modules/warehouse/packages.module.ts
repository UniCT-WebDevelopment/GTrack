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
import { ManagePackagesComponent } from './manage/manage.packages.component';
import { PackagesRoutingModule } from './packages-routing.module';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {MultiSelectModule} from 'primeng/multiselect';
import {TableModule} from 'primeng/table';
import {MessagesModule} from 'primeng/messages'
import {ConfirmDialogModule} from 'primeng/confirmdialog'
import { ConfirmationService } from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { SharedModule } from '../../shared/components/shared.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    ManagePackagesComponent
  ],
  imports: [
    PackagesRoutingModule,
    CommonModule,
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
    SharedModule,
    TranslateModule
  ],
  exports: [
    ManagePackagesComponent,
  ],
  bootstrap: [ManagePackagesComponent],
  providers: [ConfirmationService],
})
export class PackagesModule { }
