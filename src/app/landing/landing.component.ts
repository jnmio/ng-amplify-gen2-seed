/**
 * Landing Page Component
 * 
 * This is the public homepage of the application. It's accessible without
 * authentication and serves as the entry point for new users.
 * 
 * Features:
 * - Hero section with application introduction
 * - Feature highlights showcasing app benefits
 * - Call-to-action buttons directing users to sign up/login
 * - Responsive design for all device sizes
 * 
 * This component is displayed when users visit the root URL or /landing
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [
    RouterLink // Enables routerLink directive for navigation
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  // Component title (can be used in template if needed)
  title = 'ng-landing';
  
  // Current year for dynamic copyright display
  currentYear = new Date().getFullYear();
}
