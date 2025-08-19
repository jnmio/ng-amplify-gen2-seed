/**
 * Main App Component
 * 
 * This is the root component that wraps the entire application.
 * It provides:
 * - Global navigation bar with authentication-aware menu items
 * - User authentication status display
 * - Global logout functionality
 * - Footer with application information
 * - Router outlet for all page components
 */

import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  // Import Angular modules needed for this component
  imports: [
    CommonModule,        // Provides *ngIf, *ngFor directives
    RouterOutlet,        // Provides <router-outlet> for navigation
    RouterLink,          // Provides routerLink directive for navigation
    RouterLinkActive,    // Provides routerLinkActive for active route styling
    AsyncPipe           // Provides | async pipe for observables
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Application title (can be used in templates)
  title = 'MyApp';
  
  // Current year for copyright display in footer
  currentYear = new Date().getFullYear();

  /**
   * Inject AuthService as public so it can be accessed in the template
   * This allows us to check authentication status and user info in the HTML
   */
  constructor(public authService: AuthService) {}

  /**
   * Logout function called from the navigation bar
   * Delegates to the AuthService to handle the actual logout process
   */
  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
