import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, CartItem } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  cartCount$: Observable<number>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.getCartItems();
    this.cartTotal$ = this.cartService.getCartTotal();
    this.cartCount$ = this.cartService.getCartCount();
    this.loading$ = this.cartService.getLoading();
    this.error$ = this.cartService.getError();
  }

  updateQuantity(item: CartItem, quantity: number) {
    this.cartService.addToCart(item.product, quantity);
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product.id);
  }

  clearCart() {
    this.cartService.clearCart();
  }
} 