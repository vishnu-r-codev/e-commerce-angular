import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import type { HomeModule } from './pages/home/home.module';
import type { ProductsModule } from './pages/products/products.module';
import type { CartModule } from './pages/cart/cart.module';
import type { AuthModule } from './pages/auth/auth.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => 
      import('./pages/home/home.module').then((m): typeof HomeModule => m.HomeModule)
  },
  {
    path: 'products',
    loadChildren: () => 
      import('./pages/products/products.module').then((m): typeof ProductsModule => m.ProductsModule)
  },
  {
    path: 'cart',
    loadChildren: () => 
      import('./pages/cart/cart.module').then((m): typeof CartModule => m.CartModule)
  },
  {
    path: 'auth',
    loadChildren: () => 
      import('./pages/auth/auth.module').then((m): typeof AuthModule => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }