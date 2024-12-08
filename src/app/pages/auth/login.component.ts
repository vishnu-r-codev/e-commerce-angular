import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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

          <button 
            type="submit" 
            class="submit-btn"
            [disabled]="loginForm.invalid || isLoading"
          >
            @if (isLoading) {
              <span>Loading...</span>
            } @else {
              <span>Login</span>
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/auth/register">Register</a></p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./auth.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.loginForm.get(field);
    return !!formControl && formControl.invalid && formControl.touched;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
} 