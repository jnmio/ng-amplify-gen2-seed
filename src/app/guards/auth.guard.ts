/**
 * Authentication Guard
 * 
 * This guard protects routes that require authentication. It implements Angular's
 * CanActivate interface to determine if a route can be accessed.
 * 
 * How it works:
 * 1. When a protected route is accessed, this guard runs first
 * 2. It checks if the user is authenticated via the AuthService
 * 3. If authenticated, allows access to the route
 * 4. If not authenticated, redirects to the login page
 * 
 * Usage:
 * Add this guard to routes in app.routes.ts using: canActivate: [AuthGuard]
 */

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root' // Available application-wide
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService, // For checking authentication status
    private router: Router            // For navigation/redirection
  ) {}

  /**
   * Determine if the route can be activated
   * 
   * This method is automatically called by Angular when a protected route
   * is accessed. It must return a boolean or Promise<boolean> to indicate
   * whether the route should be accessible.
   * 
   * @returns Promise<boolean> - true if route can be accessed, false otherwise
   */
  async canActivate(): Promise<boolean> {
    // Check current authentication status
    const isAuthenticated = await this.authService.checkAuthStatus();
    
    if (!isAuthenticated) {
      // User is not authenticated
      console.log('🚫 Access denied - redirecting to login');
      
      // Redirect to login page
      this.router.navigate(['/login']);
      
      // Deny access to the requested route
      return false;
    }
    
    // User is authenticated - allow access to the route
    console.log('✅ Access granted - user is authenticated');
    return true;
  }
}
