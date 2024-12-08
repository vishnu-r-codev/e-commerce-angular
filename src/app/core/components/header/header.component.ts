import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService, User } from '../../services/auth.service';
import { MockDataService, Product } from '../../services/mock-data.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;
  currentUser: User | null = null;
  isMobileMenuOpen = false;
  isUserMenuOpen = false;
  searchQuery: string = '';
  searchResults: Product[] = [];
  isSearching = false;
  private searchSubject = new Subject<string>();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private mockDataService: MockDataService,
    private router: Router
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnInit() {
    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.isUserMenuOpen = false;
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.isUserMenuOpen = false;
  }

  onSearchChange(query: string) {
    this.isSearching = query.length > 0;
    this.searchSubject.next(query);
  }

  performSearch(query: string) {
    if (query.length > 0) {
      this.mockDataService.searchProducts(query).subscribe(results => {
        this.searchResults = results.slice(0, 5);
      });
    } else {
      this.searchResults = [];
    }
  }

  goToProduct(product: Product) {
    this.searchQuery = '';
    this.searchResults = [];
    this.isSearching = false;
    this.router.navigate(['/products', product.id]);
  }
} 