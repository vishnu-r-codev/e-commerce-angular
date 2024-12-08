import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, User } from '../../core/services/auth.service';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: number;
  date: Date;
  items: OrderItem[];
  total: number;
  status: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  isLoading = false;
  orders: Order[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: ['', Validators.required],
      newPassword: ['']
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
      } else {
        this.router.navigate(['/auth/login']);
      }
    });

    // Load orders (mock data for now)
    this.orders = [
      {
        id: 1,
        date: new Date(),
        items: [
          {
            id: 1,
            name: 'Wireless Headphones',
            quantity: 1,
            price: 199.99,
            image: 'https://placehold.co/100x100/333/fff?text=Headphones'
          }
        ],
        total: 199.99,
        status: 'Delivered'
      }
    ];
  }

  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!control && control.invalid && control.touched;
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.authService.updateProfile(this.profileForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          // Show success message
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Profile update error:', error);
          // Show error message
        }
      });
    } else {
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
} 