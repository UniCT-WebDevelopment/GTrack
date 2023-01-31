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
import { ManageTracksComponent } from './manage/manage.tracks.component';
import { TracksRoutingModule } from './tracks-routing.module';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {MultiSelectModule} from 'primeng/multiselect';
import {TableModule} from 'primeng/table';
import {MessagesModule} from 'primeng/messages'
import {ConfirmDialogModule} from 'primeng/confirmdialog'
import { ConfirmationService } from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from '../../shared/components/shared.module';
import { TripsDetailsTracksComponent } from './tripsDetails/tripsDetails.tracks.component';
import { MaintenanceTracksComponent } from './maintenance/maintenance.tracks.component';


@NgModule({
  declarations: [
    ManageTracksComponent,
    TripsDetailsTracksComponent,
    MaintenanceTracksComponent
  ],
  imports: [
    TracksRoutingModule,
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
    TranslateModule,
    TooltipModule,
    SharedModule
    
  ],
  bootstrap: [ManageTracksComponent],
  providers: [ConfirmationService],
})
export class TracksModule { }
