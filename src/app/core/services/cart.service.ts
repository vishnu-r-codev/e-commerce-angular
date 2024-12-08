import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from './mock-data.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems$ = new BehaviorSubject<CartItem[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$.asObservable();
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0))
    );
  }

  getCartCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
  }

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItems$.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.cartItems$.next([...currentItems]);
    } else {
      this.cartItems$.next([...currentItems, { product, quantity }]);
    }
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems$.value;
    this.cartItems$.next(currentItems.filter(item => item.product.id !== productId));
  }

  clearCart() {
    this.cartItems$.next([]);
  }

  getLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  getError(): Observable<string | null> {
    return this.error$.asObservable();
  }
} 