import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
  path: 'pdf-viewer-page',
  loadComponent: () => import('./pdf-viewer-page/pdf-viewer-page.page').then(m => m.PdfViewerPagePage)
},

  {
    path: '',
    redirectTo: 'login-page',  // Redirect to login page first
    pathMatch: 'full'
  },
  {
    path: 'login-page',
    loadChildren: () => import('./login-page/login-page.module').then(m => m.LoginPagePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'pdf-viewer-page',
    loadChildren: () => import('./pdf-viewer-page/pdf-viewer-page.module').then( m => m.PdfViewerPagePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { } 
