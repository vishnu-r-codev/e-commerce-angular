import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              id="name"
              type="text"
              formControlName="name"
              [class.error]="isFieldInvalid('name')"
            >
            @if (isFieldInvalid('name')) {
              <div class="error-message">
                Name is required
              </div>
            }
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              type="email"
              formControlName="email"
              [class.error]="isFieldInvalid('email')"
            >
            @if (isFieldInvalid('email')) {
              <div class="error-message">
                Please enter a valid email address
              </div>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              type="password"
              formControlName="password"
              [class.error]="isFieldInvalid('password')"
            >
            @if (isFieldInvalid('password')) {
              <div class="error-message">
                Password must be at least 6 characters
              </div>
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              [class.error]="isFieldInvalid('confirmPassword')"
            >
            @if (isFieldInvalid('confirmPassword')) {
              <div class="error-message">
                Passwords must match
              </div>
            }
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            [disabled]="registerForm.invalid || isLoading"
          >
            @if (isLoading) {
              <span>Loading...</span>
            } @else {
              <span>Register</span>
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Login</a></p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./auth.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.registerForm.get(field);
    return !!formControl && formControl.invalid && formControl.touched;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
} 