import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="success-container">
      <div class="success-card">
        <i class="pi pi-check-circle"></i>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for shopping with My Shop. Your order has been confirmed.</p>
        <p>Order number: #{{generateOrderNumber()}}</p>
        <div class="actions">
          <button routerLink="/profile">View Orders</button>
          <button routerLink="/products">Continue Shopping</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: var(--surface-ground);
    }

    .success-card {
      background: white;
      padding: 3rem;
      border-radius: var(--border-radius);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 500px;

      i {
        font-size: 4rem;
        color: #4CAF50;
        margin-bottom: 1rem;
      }

      h1 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      p {
        color: #666;
        margin-bottom: 1rem;

        &:last-of-type {
          margin-bottom: 2rem;
        }
      }
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;

      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: var(--border-radius);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &:first-child {
          background: var(--surface-ground);
          color: var(--primary-color);

          &:hover {
            background: darken(#f8f9fa, 5%);
          }
        }

        &:last-child {
          background: var(--primary-color);
          color: white;

          &:hover {
            background: darken(#3B82F6, 10%);
          }
        }
      }
    }

    @media (max-width: 480px) {
      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class CheckoutSuccessComponent {
  generateOrderNumber(): string {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }
} 