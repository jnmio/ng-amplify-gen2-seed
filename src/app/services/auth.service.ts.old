/**
 * Authentication Service
 * 
 * This service manages the application's authentication state and provides
 * methods for checking authentication status, logging out, and maintaining
 * user session information throughout the application.
 * 
 * Key Features:
 * - Centralized authentication state management
 * - Observable streams for reactive UI updates
 * - AWS Amplify integration for authentication
 * - Automatic session persistence and recovery
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { getCurrentUser, signOut } from '@aws-amplify/auth';
import { AuthUser } from '@aws-amplify/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // This service is available application-wide as a singleton
})
export class AuthService {
  // Private subjects for internal state management
  // BehaviorSubject holds the current value and emits it to new subscribers
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);

  // Public observables for components to subscribe to
  // Components can subscribe to these to react to authentication changes
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Check authentication status when service is created
    this.checkAuthStatus();
  }

  /**
   * Check if user is currently authenticated
   * 
   * This method queries AWS Amplify to determine if there's an active session.
   * It updates the internal state and returns the authentication status.
   * 
   * @returns Promise<boolean> - true if authenticated, false otherwise
   */
  async checkAuthStatus(): Promise<boolean> {
    try {
      // Query AWS Amplify for current authenticated user
      const user = await getCurrentUser();
      
      // User found - update state to authenticated
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(user);
      return true;
    } catch (error) {
      // No authenticated user found - update state to not authenticated
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
      return false;
    }
  }

  /**
   * Log out the current user
   * 
   * This method signs out the user from AWS Amplify, clears the local state,
   * and redirects to the landing page.
   */
  async logout(): Promise<void> {
    try {
      // Sign out from AWS Amplify
      await signOut();
      
      // Clear local authentication state
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
      
      // Redirect to landing page
      this.router.navigate(['/landing']);
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if sign out fails, clear local state and redirect
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
      this.router.navigate(['/landing']);
    }
  }

  /**
   * Set user as authenticated
   * 
   * This method is called when login is successful to update the service state.
   * Typically called from the login component after successful authentication.
   * 
   * @param user - The authenticated user object from AWS Amplify
   */
  setAuthenticated(user: AuthUser): void {
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(user);
  }

  /**
   * Get current authentication status (synchronous)
   * 
   * @returns boolean - current authentication state
   */
  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user (synchronous)
   * 
   * @returns AuthUser | null - current user object or null if not authenticated
   */
  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }
}
