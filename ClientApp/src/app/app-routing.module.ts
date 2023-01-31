import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthRootGuardService } from './modules/auth/auth.root.guard';
import { AuthChildGuardService } from './modules/auth/auth.child.guard';
import { MenuResolverService } from './modules/sidebar-layout/sidebar-resolver.service';
//import { UIResolver } from './pages/home/ui.resolver';

const routes: Routes = [
  {
    path: '', component: AppComponent,
    //outlet: 'main',
    canActivate: [AuthRootGuardService],
  },
  {
    path: 'admin',
    canActivate: [AuthChildGuardService],
    resolve: {menu: MenuResolverService},
    //outlet: 'main',
    loadChildren: () => import('./modules/sidebar-layout/sidebar-layout.module').then(m => m.SidebarLayoutModule)
  },
  { path: 'auth',
    //outlet: 'main',
   loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '**',
    //outlet: 'mainRouting',
    redirectTo: 'admin/trips',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    //initialNavigation: 'enabled',
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
