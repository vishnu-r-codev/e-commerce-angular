import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService, Product } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  categories: string[] = [];
  featuredProducts: Product[] = [];

  constructor(private mockDataService: MockDataService) {
    this.mockDataService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.mockDataService.getProducts().subscribe(products => {
      // Get top rated products as featured
      this.featuredProducts = products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
    });
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Electronics': 'pi pi-desktop',
      'Clothing': 'pi pi-shopping-bag',
      'Books': 'pi pi-book',
      'Home': 'pi pi-home',
      'Sports': 'pi pi-heart',
      'Beauty': 'pi pi-star'
    };
    return icons[category] || 'pi pi-tag';
  }
} 