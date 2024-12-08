import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService, Product, CategoryType } from '../../../core/services/mock-data.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  relatedProducts: Product[] = [];
  quantity: number = 1;
  isLoading = true;
  activeImageIndex = 0;
  selectedTab: 'description' | 'specifications' | 'reviews' = 'description';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadProduct(id);
    });
  }

  private loadProduct(id: number) {
    this.isLoading = true;
    this.mockDataService.getProductById(id).subscribe(product => {
      if (product) {
        this.product = product;
        this.loadRelatedProducts(product.category);
      } else {
        this.router.navigate(['/products']);
      }
      this.isLoading = false;
    });
  }

  private loadRelatedProducts(category: CategoryType) {
    this.mockDataService.getProductsByCategory(category).subscribe(products => {
      this.relatedProducts = products
        .filter(p => p.id !== this.product?.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
    });
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      // Show success message or navigate to cart
    }
  }

  updateQuantity(change: number) {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1 && newQuantity <= (this.product?.stock || 1)) {
      this.quantity = newQuantity;
    }
  }

  getRatingStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }

  getStockStatus(): { text: string; class: string } {
    if (!this.product) return { text: '', class: '' };
    
    const stock = this.product.stock;
    if (stock > 20) {
      return { text: 'In Stock', class: 'in-stock' };
    } else if (stock > 0) {
      return { text: `Only ${stock} left`, class: 'low-stock' };
    } else {
      return { text: 'Out of Stock', class: 'out-of-stock' };
    }
  }

  generateMockSpecifications(): { label: string; value: string }[] {
    if (!this.product) return [];

    const commonSpecs = [
      { label: 'Brand', value: this.product.name.split(' ')[0] },
      { label: 'Model', value: `${new Date().getFullYear()} Edition` },
      { label: 'Category', value: this.product.category },
      { label: 'Rating', value: `${this.product.rating} out of 5` }
    ];

    // Add category-specific specifications
    switch (this.product.category) {
      case 'Electronics':
        return [
          ...commonSpecs,
          { label: 'Warranty', value: '1 Year' },
          { label: 'Power', value: '100-240V' },
          { label: 'Connectivity', value: 'Bluetooth 5.0' }
        ];
      case 'Clothing':
        return [
          ...commonSpecs,
          { label: 'Material', value: 'Premium Cotton' },
          { label: 'Care', value: 'Machine Washable' },
          { label: 'Style', value: 'Contemporary' }
        ];
      case 'Books':
        return [
          ...commonSpecs,
          { label: 'Format', value: 'Hardcover' },
          { label: 'Pages', value: '350' },
          { label: 'Language', value: 'English' }
        ];
      case 'Home & Kitchen':
        return [
          ...commonSpecs,
          { label: 'Material', value: 'Premium Quality' },
          { label: 'Dimensions', value: '30 x 20 x 15 cm' },
          { label: 'Care', value: 'Easy Clean' }
        ];
      case 'Sports':
        return [
          ...commonSpecs,
          { label: 'Material', value: 'High Performance' },
          { label: 'Usage', value: 'Professional' },
          { label: 'Care', value: 'Easy Maintenance' }
        ];
      case 'Beauty':
        return [
          ...commonSpecs,
          { label: 'Type', value: 'Professional Grade' },
          { label: 'Volume', value: '200ml' },
          { label: 'Skin Type', value: 'All Types' }
        ];
      case 'Toys':
        return [
          ...commonSpecs,
          { label: 'Age Range', value: '3+ Years' },
          { label: 'Material', value: 'Child Safe' },
          { label: 'Battery', value: 'Not Required' }
        ];
      case 'Jewelry':
        return [
          ...commonSpecs,
          { label: 'Material', value: 'Premium Quality' },
          { label: 'Style', value: 'Contemporary' },
          { label: 'Occasion', value: 'All' }
        ];
      default:
        return commonSpecs;
    }
  }

  generateMockReviews(): any[] {
    return Array(5).fill(0).map((_, i) => ({
      user: `User${i + 1}`,
      rating: 4 + Math.random(),
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      comment: 'Great product! Exactly as described.'
    }));
  }
} 