import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartTotal: number = 0;
  cartCount: number = 0;
  isProcessing = false;

  paymentMethods: PaymentMethod[] = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'pi pi-credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'pi pi-paypal' },
    { id: 'apple', name: 'Apple Pay', icon: 'pi pi-apple' },
    { id: 'google', name: 'Google Pay', icon: 'pi pi-google' }
  ];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      shipping: this.fb.group({
        fullName: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
      }),
      payment: this.fb.group({
        method: ['card', Validators.required],
        cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
        expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
        cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
      })
    });
  }

  ngOnInit() {
    this.cartService.getCartTotal().subscribe(total => {
      this.cartTotal = total;
    });

    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });

    // Pre-fill shipping info if user is logged in
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.checkoutForm.patchValue({
          shipping: {
            fullName: user.name,
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      this.isProcessing = true;
      
      // Simulate payment processing
      setTimeout(() => {
        this.cartService.clearCart();
        this.router.navigate(['/checkout/success']);
        this.isProcessing = false;
      }, 2000);
    } else {
      Object.keys(this.checkoutForm.controls).forEach(key => {
        const control = this.checkoutForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  isFieldInvalid(formGroup: string, field: string): boolean {
    const control = this.checkoutForm.get(`${formGroup}.${field}`);
    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(formGroup: string, field: string): string {
    const control = this.checkoutForm.get(`${formGroup}.${field}`);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }

    if (control.hasError('pattern')) {
      switch (field) {
        case 'zipCode':
          return 'Please enter a valid ZIP code';
        case 'phone':
          return 'Please enter a valid 10-digit phone number';
        case 'cardNumber':
          return 'Please enter a valid 16-digit card number';
        case 'expiryDate':
          return 'Please enter a valid expiry date (MM/YY)';
        case 'cvv':
          return 'Please enter a valid 3-digit CVV';
        default:
          return 'Invalid format';
      }
    }

    return '';
  }
} 