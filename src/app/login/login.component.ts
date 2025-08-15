/**
 * Login Component
 * 
 * This component handles user authentication using AWS Amplify UI.
 * It provides a complete authentication flow including:
 * - Sign in for existing users
 * - Sign up for new users
 * - Password reset functionality
 * - MFA support (if configured)
 * 
 * Key Features:
 * - Automatic redirection for already authenticated users
 * - Loading states during authentication checks
 * - Integration with AuthService for state management
 * - Responsive design with AWS Amplify UI components
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import { getCurrentUser } from '@aws-amplify/auth';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,                 // Provides *ngIf and other common directives
    RouterLink,                   // Provides routerLink for navigation
    AmplifyAuthenticatorModule   // AWS Amplify UI authentication component
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  // Subject for managing subscriptions and preventing memory leaks
  private destroy$ = new Subject<void>();
  
  // Loading state to show spinner while checking authentication
  isCheckingAuth = true;
  
  // Flag to prevent UI flash during redirect
  isRedirecting = false;

  constructor(
    private router: Router,                      // For navigation
    private authenticatorService: AuthenticatorService, // AWS Amplify auth service
    private authService: AuthService            // Our custom auth service
  ) {}

  /**
   * Component initialization
   * 
   * When the login page loads, we need to:
   * 1. Check if user is already authenticated (redirect if yes)
   * 2. Set up listeners for authentication state changes
   */
  async ngOnInit(): Promise<void> {
    console.log('🔐 Login Component - Initializing...');
    
    // First, check if user is already logged in
    await this.checkCurrentAuthStatus();
    
    // Listen for authentication state changes from AWS Amplify
    // This handles login/logout events in real-time
    this.authenticatorService.subscribe((state: any) => {
      console.log('🔐 Login Component - Auth state changed:', state.authStatus);
      
      // If user just successfully authenticated
      if (state.authStatus === 'authenticated') {
        console.log('✅ User authenticated - redirecting to dashboard');
        
        // Set redirecting flag to prevent UI flash
        this.isRedirecting = true;
        
        // Update our auth service with the user info
        this.authService.setAuthenticated(state.user);
        
        // Redirect to the dashboard
        this.redirectToDashboard();
      }
    });
  }

  /**
   * Check if user is already authenticated
   * 
   * This prevents showing the login form to users who are already logged in.
   * If authenticated, they're redirected to the dashboard immediately.
   */
  private async checkCurrentAuthStatus(): Promise<void> {
    try {
      console.log('🔐 Login Component - Checking current auth status...');
      
      // Query AWS Amplify for current user
      const user = await getCurrentUser();
      
      if (user) {
        // User is already authenticated
        console.log('✅ User already authenticated:', user.userId);
        console.log('🔄 Redirecting to dashboard...');
        
        // Set redirecting flag to prevent UI flash
        this.isRedirecting = true;
        
        // Update auth service state
        this.authService.setAuthenticated(user);
        
        // Redirect to dashboard immediately
        this.redirectToDashboard();
        return;
      }
    } catch (error) {
      // No authenticated user found - this is normal for new visitors
      console.log('ℹ️ No authenticated user found, showing login form');
    } finally {
      // Only stop loading spinner if we're not redirecting
      if (!this.isRedirecting) {
        this.isCheckingAuth = false;
      }
    }
  }

  /**
   * Redirect user to dashboard after successful authentication
   * 
   * Uses immediate navigation for seamless user experience
   */
  private redirectToDashboard(): void {
    // Navigate immediately to prevent UI flash
    this.router.navigate(['/auth']);
  }

  /**
   * Component cleanup
   * 
   * Prevents memory leaks by completing all observables when component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}



