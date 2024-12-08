import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

interface StoredUser extends User {
  password: string;
}

export interface ProfileUpdateData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private isBrowser: boolean;

  // Mock users database
  private mockUsers: StoredUser[] = [
    {
      id: 1,
      email: 'john@example.com',
      password: 'password123',
      name: 'John Doe'
    },
    {
      id: 2,
      email: 'jane@example.com',
      password: 'password123',
      name: 'Jane Smith'
    }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Check for saved user in localStorage only in browser environment
    if (this.isBrowser) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get isLoading$(): Observable<boolean> {
    return this.isLoadingSubject.asObservable();
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<User> {
    this.isLoadingSubject.next(true);

    const user = this.mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      
      return of(userWithoutPassword).pipe(
        delay(1000),
        tap(user => {
          if (this.isBrowser) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
          this.isLoadingSubject.next(false);
        })
      );
    }

    return throwError(() => new Error('Invalid email or password')).pipe(
      delay(1000),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  register(data: RegisterData): Observable<User> {
    this.isLoadingSubject.next(true);

    if (this.mockUsers.some(u => u.email === data.email)) {
      return throwError(() => new Error('Email already exists')).pipe(
        delay(1000),
        tap(() => this.isLoadingSubject.next(false))
      );
    }

    const newUser: StoredUser = {
      id: this.mockUsers.length + 1,
      email: data.email,
      password: data.password,
      name: data.name
    };

    this.mockUsers.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    
    return of(userWithoutPassword).pipe(
      delay(1000),
      tap(user => {
        if (this.isBrowser) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
        this.isLoadingSubject.next(false);
      })
    );
  }

  updateProfile(data: ProfileUpdateData): Observable<User> {
    this.isLoadingSubject.next(true);

    const user = this.mockUsers.find(u => 
      u.id === this.currentUserSubject.value?.id &&
      u.password === data.currentPassword
    );

    if (!user) {
      return throwError(() => new Error('Invalid current password')).pipe(
        delay(1000),
        tap(() => this.isLoadingSubject.next(false))
      );
    }

    if (data.email !== user.email && 
        this.mockUsers.some(u => u.email === data.email)) {
      return throwError(() => new Error('Email already exists')).pipe(
        delay(1000),
        tap(() => this.isLoadingSubject.next(false))
      );
    }

    user.name = data.name;
    user.email = data.email;
    if (data.newPassword) {
      user.password = data.newPassword;
    }

    const { password, ...userWithoutPassword } = user;
    
    return of(userWithoutPassword).pipe(
      delay(1000),
      tap(user => {
        if (this.isBrowser) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
        this.isLoadingSubject.next(false);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  // Helper method to get mock users (for demonstration)
  getMockUsers(): StoredUser[] {
    return this.mockUsers;
  }
} 