import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { TabMenuModule } from 'primeng/tabmenu';
import { StepsModule } from 'primeng/steps';
import { RippleModule } from 'primeng/ripple';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';
import {CheckboxModule} from 'primeng/checkbox';
import { DividerModule } from "primeng/divider";
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {MultiSelectModule} from 'primeng/multiselect';
import {TableModule} from 'primeng/table';
import {MessagesModule} from 'primeng/messages'
import {ConfirmDialogModule} from 'primeng/confirmdialog'
import { ConfirmationService } from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import { ManageTripsComponent } from './manage/manage.trips.component';
import { TripsRoutingModule } from '../trips/trips-routing.module';
import { EditTripsComponent } from './editTrip/edit.trips.component';
import { EditWizardComponent } from './editWizard/edit.wizard.component';
import { EditCostComponent } from './editCost/edit.cost.component';
import { EditStageComponent } from './editStage/edit.stage.component';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {CalendarModule} from 'primeng/calendar';
import {SpinnerModule} from 'primeng/spinner';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputNumberModule} from 'primeng/inputnumber';
import { SharedModule } from '../../shared/components/shared.module';
import { PackagesModule } from '../warehouse/packages.module';
import {TooltipModule} from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AddressPickerComponent } from "../../shared/components/addressPicker/address-picker.component";


@NgModule({
    declarations: [
        ManageTripsComponent,
        EditTripsComponent,
        EditWizardComponent,
        EditCostComponent,
        EditStageComponent,
    ],
    bootstrap: [ManageTripsComponent],
    providers: [ConfirmationService],
    imports: [
        TripsRoutingModule,
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
        TabMenuModule,
        StepsModule,
        FileUploadModule,
        HttpClientModule,
        CalendarModule,
        SpinnerModule,
        ProgressSpinnerModule,
        InputNumberModule,
        SharedModule,
        PackagesModule,
        TooltipModule,
        TranslateModule,
        OverlayPanelModule,
    ]
})
export class TripsModule { }
