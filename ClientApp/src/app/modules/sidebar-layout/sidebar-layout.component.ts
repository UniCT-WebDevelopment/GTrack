import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ApiAuthService } from '../auth/auth.service.api';
import { Menu } from './models/menu';
import { SidebarService } from './sidebar.service';
import { UIService } from './ui.service';


@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.scss'],
  animations: [
    trigger(
      'fadeNav',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('0.3s ease-in', style({ opacity: 1 }))
          ]),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('0.3s ease-out', style({ opacity: 0 }))
          ]),
      ]),
  ]
})


export class SidebarLayoutComponent implements OnInit {
  constructor(private sidebarService: SidebarService, private uis: UIService, private authServ: ApiAuthService) {

  }
  menu: Menu = { title: "default", groups: [] } as Menu
  opened = true
  isMobile: boolean = false
  over: string | null = null
  disableAnimation: boolean = true

  async ngOnInit(): Promise<void> {
    this.uis.mobile$.subscribe(v => {
      this.isMobile = v
      if (this.isMobile) this.opened = false
      //this.changeDetectorRef.detectChanges()
    })
   // this.sidebarService.$menu.subscribe(m => )
    this.menu = await this.sidebarService.getMenu()
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.disableAnimation = false)
  }

  toggleSideBar() {
    this.opened = !this.opened
  }

  logout() {
    this.authServ.logout();
  }
}
