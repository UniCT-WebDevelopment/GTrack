import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SidebarLayoutRoutingModule } from './sidebar-layout-routing.module';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { SidebarLayoutComponent } from './sidebar-layout.component';
import { TooltipModule } from 'primeng/tooltip';
import {OverlayPanelModule} from 'primeng/overlaypanel';


@NgModule({
  declarations: [
    SidebarLayoutComponent
  ],
  imports: [
    SidebarLayoutRoutingModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    BadgeModule,
    RippleModule,
    StyleClassModule,
    SelectButtonModule,
    ButtonModule,
    AccordionModule,
    TooltipModule,
    OverlayPanelModule
  ],
  providers: [],
  bootstrap: [SidebarLayoutComponent]
})
export class SidebarLayoutModule { }
