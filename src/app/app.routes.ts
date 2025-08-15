/**
 * Application Routing Configuration
 * 
 * This file defines all the routes (URLs) in the application and which components
 * should be displayed for each route. It also sets up route protection using guards.
 * 
 * Route Structure:
 * - Public routes: accessible without authentication
 * - Protected routes: require authentication (use AuthGuard)
 * - Nested routes: child routes within a parent route
 */

import { Routes } from '@angular/router';

// Import all components used in routing
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { TodosComponent } from './auth/todos/todos.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { SettingsComponent } from './auth/settings/settings.component';

// Import the authentication guard
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Default route - redirects to landing page
  { 
    path: '', 
    redirectTo: '/landing', 
    pathMatch: 'full' 
  },
  
  // PUBLIC ROUTES (no authentication required)
  
  // Landing page - public homepage
  { 
    path: 'landing', 
    component: LandingComponent 
  },
  
  // Login page - AWS Amplify authentication
  { 
    path: 'login', 
    component: LoginComponent 
  },
  
  // PROTECTED ROUTES (authentication required)
  
  // Dashboard route with nested child routes
  { 
    path: 'auth',                    // Parent route path
    component: DashboardComponent,   // Parent component (provides layout)
    canActivate: [AuthGuard],       // Protect this route and all children
    children: [                     // Child routes displayed in parent's <router-outlet>
      // Default child route - redirects to todos
      { 
        path: '', 
        redirectTo: 'todos', 
        pathMatch: 'full' 
      },
      
      // Todo management page
      { 
        path: 'todos', 
        component: TodosComponent 
      },
      
      // User profile page
      { 
        path: 'profile', 
        component: ProfileComponent 
      },
      
      // User settings page
      { 
        path: 'settings', 
        component: SettingsComponent 
      }
    ]
  },
  
  // BACKWARDS COMPATIBILITY ROUTES
  
  // Redirect old todo route to new protected route
  { 
    path: 'todo', 
    redirectTo: '/auth/todos', 
    pathMatch: 'full' 
  },
  
  // CATCH-ALL ROUTE
  
  // Any unmatched routes redirect to landing page
  // This must be the last route in the array
  { 
    path: '**', 
    redirectTo: '/landing' 
  }
];
