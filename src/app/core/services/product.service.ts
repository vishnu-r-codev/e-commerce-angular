import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDataService, Product, CategoryType } from './mock-data.service';

export interface ProductFilters {
  category: CategoryType | null;
  priceRange: [number, number];
  rating: number | null;
  sortBy: 'rating' | 'price-asc' | 'price-desc' | 'name' | null;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products$ = new BehaviorSubject<Product[]>([]);
  private selectedProduct$ = new BehaviorSubject<Product | null>(null);
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);
  private filters$ = new BehaviorSubject<ProductFilters>({
    category: null,
    priceRange: [0, 1000],
    rating: null,
    sortBy: null
  });

  constructor(private mockDataService: MockDataService) {}

  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  getFilteredProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => this.applyFilters(products, this.filters$.value))
    );
  }

  getCategories(): Observable<CategoryType[]> {
    return this.mockDataService.getCategories();
  }

  getLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  getError(): Observable<string | null> {
    return this.error$.asObservable();
  }

  getFilters(): Observable<ProductFilters> {
    return this.filters$.asObservable();
  }

  loadProducts() {
    this.loading$.next(true);
    this.error$.next(null);
    
    this.mockDataService.getProducts().subscribe({
      next: (products) => {
        this.products$.next(products);
        this.loading$.next(false);
      },
      error: (error) => {
        this.error$.next(error.message || 'Failed to load products');
        this.loading$.next(false);
      }
    });
  }

  updateFilters(filters: Partial<ProductFilters>) {
    console.log('Current filters:', this.filters$.value);
    console.log('New filter update:', filters);
    
    const newFilters = {
      ...this.filters$.value,
      ...filters
    };
    
    console.log('Updated filters:', newFilters);
    this.filters$.next(newFilters);
  }

  resetFilters() {
    this.filters$.next({
      category: null,
      priceRange: [0, 1000],
      rating: null,
      sortBy: null
    });
  }

  private applyFilters(products: Product[], filters: ProductFilters): Product[] {
    console.log('Applying filters:', filters);
    let filtered = [...products];

    if (filters.category) {
      console.log('Filtering by category:', filters.category);
      filtered = filtered.filter(p => {
        const match = p.category === filters.category;
        console.log(`Product ${p.name}: category ${p.category} matches ${filters.category}? ${match}`);
        return match;
      });
    }

    filtered = filtered.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.rating) {
      filtered = filtered.filter(p => p.rating >= filters.rating!);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    console.log('Filtered products:', filtered.length);
    return filtered;
  }

  getSelectedProduct(): Observable<Product | null> {
    return this.selectedProduct$.asObservable();
  }

  loadProduct(id: number) {
    this.loading$.next(true);
    this.error$.next(null);
    
    this.mockDataService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.selectedProduct$.next(product);
        } else {
          this.error$.next('Product not found');
        }
        this.loading$.next(false);
      },
      error: (error) => {
        this.error$.next(error.message || 'Failed to load product');
        this.loading$.next(false);
      }
    });
  }
} 