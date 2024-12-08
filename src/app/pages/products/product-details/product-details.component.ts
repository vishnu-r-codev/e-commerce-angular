import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../../../core/services/mock-data.service';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product$: Observable<Product | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  quantity = 1;
  selectedTab: 'description' | 'reviews' | 'shipping' | 'specifications' = 'description';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.product$ = this.productService.getSelectedProduct();
    this.loading$ = this.productService.getLoading();
    this.error$ = this.productService.getError();
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.loadProduct(id);
    }
  }

  updateQuantity(change: number) {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1) {
      this.quantity = newQuantity;
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, this.quantity);
    this.quantity = 1; // Reset after adding
  }

  getRatingStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }

  getStockStatus(product: Product) {
    if (product.stock > 10) {
      return { class: 'in-stock', text: 'In Stock' };
    } else if (product.stock > 0) {
      return { class: 'low-stock', text: `Only ${product.stock} left` };
    } else {
      return { class: 'out-of-stock', text: 'Out of Stock' };
    }
  }

  generateMockSpecifications(product: Product) {
    return [
      { label: 'Brand', value: product.brand || 'Generic' },
      { label: 'Model', value: product.model || 'Standard' },
      { label: 'Weight', value: '1.2 kg' },
      { label: 'Dimensions', value: '30 x 20 x 10 cm' },
      { label: 'Material', value: 'Premium Quality' }
    ];
  }

  generateMockReviews() {
    return [
      { user: 'John D.', rating: 5, comment: 'Excellent product!', date: new Date('2024-02-01') },
      { user: 'Sarah M.', rating: 4, comment: 'Good value for money.', date: new Date('2024-01-15') }
    ];
  }
} 