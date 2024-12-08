import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService, Product } from '../../core/services/mock-data.service';
import { CartService } from '../../core/services/cart.service';

interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number | null;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'name';
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  isLoading = true;
  
  filters: FilterState = {
    category: '',
    priceRange: [0, 1000],
    rating: null,
    sortBy: 'rating'
  };

  constructor(
    private mockDataService: MockDataService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get category from route query params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filters.category = params['category'];
      }
    });

    // Load categories and products
    this.mockDataService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.mockDataService.getProducts().subscribe(products => {
      this.products = products;
      this.applyFilters();
      this.isLoading = false;
    });
  }

  applyFilters() {
    let result = [...this.products];

    // Apply category filter
    if (this.filters.category) {
      result = result.filter(p => p.category === this.filters.category);
    }

    // Apply price range filter
    result = result.filter(p => 
      p.price >= this.filters.priceRange[0] && 
      p.price <= this.filters.priceRange[1]
    );

    // Apply rating filter
    if (this.filters.rating) {
      result = result.filter(p => p.rating >= this.filters.rating!);
    }

    // Apply sorting
    switch (this.filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    this.filteredProducts = result;
  }

  resetFilters() {
    this.filters = {
      category: '',
      priceRange: [0, 1000],
      rating: null,
      sortBy: 'rating'
    };
    this.applyFilters();
  }

  quickAddToCart(product: Product, event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(product);
  }

  getRatingStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }
} 