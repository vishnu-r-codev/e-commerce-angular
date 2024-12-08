import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product, CategoryType } from '../../core/services/mock-data.service';
import { ProductService, ProductFilters } from '../../core/services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  categories$: Observable<CategoryType[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  filters$: Observable<ProductFilters>;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    this.products$ = this.productService.getFilteredProducts();
    this.categories$ = this.productService.getCategories();
    this.loading$ = this.productService.getLoading();
    this.error$ = this.productService.getError();
    this.filters$ = this.productService.getFilters();
  }

  ngOnInit() {
    this.productService.loadProducts();
    
    // Handle category filter from route params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.updateFilters({ category: params['category'] as CategoryType });
      }
    });
  }

  updateFilters(filters: Partial<ProductFilters>) {
    console.log('Updating filters:', filters);
    this.productService.updateFilters(filters);
  }

  resetFilters() {
    this.productService.resetFilters();
  }

  handlePriceChange(event: Event, currentMax: number) {
    const value = (event.target as HTMLInputElement).value;
    this.updateFilters({ 
      priceRange: [parseInt(value, 10), currentMax] 
    });
  }

  handleSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as ProductFilters['sortBy'];
    this.updateFilters({ sortBy: value });
  }

  getRatingStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }

  retryLoading() {
    this.productService.loadProducts();
  }
} 