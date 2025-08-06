# 🚀 Angular + AWS Amplify Gen2 Template - Complete Tutorial

This template provides a **production-ready foundation** for building secure Angular applications with AWS Amplify authentication. Perfect for developers who want to get started quickly with a clean, well-documented codebase.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Component Documentation](#component-documentation)
4. [AWS Amplify Setup](#aws-amplify-setup)
5. [Authentication Flow](#authentication-flow)
6. [Security Features](#security-features)
7. [Customization Guide](#customization-guide)
8. [Troubleshooting](#troubleshooting)

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI (`npm install -g @angular/cli`)
- AWS Account (for Amplify backend)

### Installation

```bash
# 1. Clone or download this template
git clone <your-repo-url>
cd ng-template-with-auth

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Open browser to http://localhost:4200
```

### Backend Setup (Required for full functionality)

```bash
# 1. Install Amplify CLI
npm install -g @aws-amplify/cli

# 2. Configure Amplify (first time only)
amplify configure

# 3. Deploy backend
amplify push

# 4. Generate frontend configuration
npx ampx generate outputs
```

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/                    # 🔒 Protected Components (Authentication Required)
│   │   ├── dashboard/          # Main dashboard with navigation
│   │   ├── todos/             # Todo management (CRUD operations)
│   │   ├── profile/           # User profile page
│   │   └── settings/          # User settings page
│   │
│   ├── guards/                 # 🛡️ Route Protection
│   │   └── auth.guard.ts      # Prevents unauthorized access
│   │
│   ├── services/              # 🔧 Application Services
│   │   └── auth.service.ts    # Authentication state management
│   │
│   ├── landing/               # 🏠 Public Landing Page
│   ├── login/                 # 🔐 Authentication Page
│   │
│   ├── app.component.*        # 🌟 Main App Shell
│   ├── app.routes.ts          # 🛣️ Routing Configuration
│   └── app.config.ts          # ⚙️ Application Configuration
│
├── main.ts                    # 🚀 Application Entry Point
└── styles.css                 # 🎨 Global Styles
```

## 📖 Component Documentation

### 🌟 App Component (`app.component.*`)

**Purpose**: The root component that provides global layout and navigation.

**Key Features**:
- **Responsive Navigation**: Shows different menu items based on authentication status
- **User Display**: Shows welcome message with username when logged in
- **Global Logout**: Logout button available from any page
- **Footer**: Consistent footer with app information

**Template Structure**:
```html
<!-- Fixed top navigation with Bootstrap styling -->
<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
  <!-- Brand logo and mobile toggle -->
  <!-- Navigation links (Home, Dashboard for authenticated users) -->
  <!-- User area (Login button or user info + logout) -->
</nav>

<!-- Main content area where page components are displayed -->
<main class="main-content">
  <router-outlet /> <!-- This is where page components appear -->
</main>

<!-- Footer with copyright and links -->
<footer class="footer">
  <!-- App info and external links -->
</footer>
```

### 🏠 Landing Component (`landing/`)

**Purpose**: Public homepage that welcomes visitors and encourages sign-up.

**Key Features**:
- **Hero Section**: Eye-catching headline and call-to-action buttons
- **Features Section**: Highlights of what the application offers
- **Responsive Design**: Looks great on all device sizes
- **Call-to-Action**: Multiple paths to the login/signup process

### 🔐 Login Component (`login/`)

**Purpose**: Handles all authentication using AWS Amplify UI components.

**Key Features**:
- **AWS Amplify Integration**: Complete auth flow (login, signup, password reset)
- **Loading States**: Shows spinner while checking authentication status
- **Auto-redirect**: Sends already-authenticated users to dashboard
- **Error Handling**: Graceful handling of authentication errors

**Authentication Flow**:
```typescript
ngOnInit() {
  // 1. Check if user is already authenticated
  await this.checkCurrentAuthStatus();
  
  // 2. Listen for authentication state changes
  this.authenticatorService.subscribe((state) => {
    if (state.authStatus === 'authenticated') {
      // 3. Update auth service and redirect to dashboard
      this.authService.setAuthenticated(state.user);
      this.redirectToDashboard();
    }
  });
}
```

### 🔒 Dashboard Component (`auth/dashboard/`)

**Purpose**: Main layout for authenticated users with sidebar navigation.

**Key Features**:
- **Sidebar Navigation**: Links to todos, profile, settings
- **Nested Routing**: Uses `<router-outlet>` for child components
- **Welcome Cards**: Overview of available features when no child route is active

### ✅ Todos Component (`auth/todos/`)

**Purpose**: Demonstrates CRUD operations with AWS Amplify DataStore.

**Key Features**:
- **Real-time Data**: Syncs with AWS DynamoDB
- **CRUD Operations**: Create, read, update, delete todos
- **Error Handling**: Graceful fallbacks when backend isn't configured
- **User Context**: Shows which user's todos are displayed

**Data Flow**:
```typescript
// 1. Check Amplify configuration
checkAmplifyConfiguration() {
  this.amplifyConfigured = !!(this.client?.models?.['Todo']);
}

// 2. Load todos from backend
async listTodos() {
  const { data: items } = await this.client.models['Todo']['list']({});
  this.todos = items || [];
}

// 3. Create new todo
async createTodo() {
  await this.client.models['Todo']['create']({ content });
  this.listTodos(); // Refresh list
}
```

## 🔧 Service Documentation

### 🛡️ AuthService (`services/auth.service.ts`)

**Purpose**: Centralized authentication state management.

**Key Features**:
- **Observable Streams**: Components can reactively respond to auth changes
- **Session Persistence**: Maintains auth state across page refreshes
- **Centralized Logout**: Single method to handle logout from anywhere

**Usage in Components**:
```typescript
// Inject the service
constructor(public authService: AuthService) {}

// Check authentication status in templates
*ngIf="(authService.isAuthenticated$ | async)"

// Get current user info
{{ (authService.currentUser$ | async)?.username }}

// Logout from any component
await this.authService.logout();
```

### 🛡️ AuthGuard (`guards/auth.guard.ts`)

**Purpose**: Protects routes that require authentication.

**How it works**:
1. Router tries to navigate to protected route
2. AuthGuard.canActivate() method runs first
3. Checks authentication status via AuthService
4. Returns `true` (allow access) or `false` (redirect to login)

**Usage in Routes**:
```typescript
{
  path: 'auth',
  component: DashboardComponent,
  canActivate: [AuthGuard], // This protects the route
  children: [
    // All child routes are also protected
  ]
}
```

## 🌐 Routing Documentation

### Route Structure

```typescript
export const routes: Routes = [
  // DEFAULT: Redirect to landing page
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  
  // PUBLIC ROUTES (no authentication required)
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  
  // PROTECTED ROUTES (authentication required)
  {
    path: 'auth',
    component: DashboardComponent,
    canActivate: [AuthGuard], // 🛡️ Protection here
    children: [
      { path: 'todos', component: TodosComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
  
  // FALLBACK: Unknown routes go to landing
  { path: '**', redirectTo: '/landing' }
];
```

### URL Structure

- **Public URLs**:
  - `/` → Redirects to `/landing`
  - `/landing` → Public homepage
  - `/login` → Authentication page

- **Protected URLs** (require login):
  - `/auth` → Dashboard (redirects to `/auth/todos`)
  - `/auth/todos` → Todo management
  - `/auth/profile` → User profile
  - `/auth/settings` → User settings

## 🔐 AWS Amplify Setup Guide

### 1. Initial Setup

```bash
# Install Amplify CLI globally
npm install -g @aws-amplify/cli

# Configure Amplify with your AWS credentials
amplify configure
```

### 2. Initialize Amplify Project

```bash
# In your project root
amplify init

# Follow the prompts:
# - Project name: your-app-name
# - Environment: dev
# - Default editor: your-preference
# - Framework: angular
# - Source directory: src
# - Distribution directory: dist/your-app-name
# - Build command: npm run build
# - Start command: npm start
```

### 3. Add Authentication

```bash
# Add Cognito authentication
amplify add auth

# Choose:
# - Default configuration
# - Username (or email)
# - No, I am done
```

### 4. Add API (Optional - for todos)

```bash
# Add GraphQL API
amplify add api

# Choose:
# - GraphQL
# - API name: your-api-name
# - Authorization: Amazon Cognito User Pool
# - Additional auth types: No
# - Conflict resolution: Auto Merge
# - Schema template: Single object with fields
```

### 5. Deploy Backend

```bash
# Deploy all resources to AWS
amplify push

# This creates:
# - Cognito User Pool (authentication)
# - GraphQL API (if added)
# - DynamoDB tables (if using API)
```

### 6. Generate Configuration

```bash
# Generate frontend configuration file
npx ampx generate outputs

# This creates: amplify_outputs.json
# This file is automatically imported in main.ts
```

## 🔄 Authentication Flow Diagram

```
User visits app
       ↓
   main.ts runs
       ↓
 Amplify.configure()
       ↓
 App Component loads
       ↓
AuthService.checkAuthStatus()
       ↓
    Authenticated?
       ↓              ↓
     Yes              No
       ↓              ↓
Show Dashboard    Show Landing/Login
       ↓              ↓
Protected content   Public content
```

## 🛠️ Customization Guide

### Adding New Protected Pages

1. **Create Component**:
```bash
ng generate component auth/my-new-page
```

2. **Add Route**:
```typescript
// In app.routes.ts, add to auth children:
{ path: 'my-new-page', component: MyNewPageComponent }
```

3. **Add Navigation**:
```html
<!-- In dashboard.component.html -->
<a routerLink="/auth/my-new-page" routerLinkActive="active" class="nav-link">
  My New Page
</a>
```

### Customizing Styling

**Global Styles** (`src/styles.css`):
```css
/* Override Bootstrap variables */
:root {
  --bs-primary: #your-color;
}

/* Custom component styles */
.your-custom-class {
  /* Your styles */
}
```

**Component-Specific Styles**:
Each component has its own `.css` file for isolated styling.

### Adding New AWS Services

1. **Add Service to Amplify**:
```bash
amplify add storage  # For file uploads
amplify add function # For Lambda functions
amplify add hosting  # For deployment
```

2. **Update Configuration**:
```bash
amplify push
npx ampx generate outputs
```

3. **Use in Components**:
```typescript
import { uploadData } from 'aws-amplify/storage';
// Use Amplify services in your components
```

## 🐛 Troubleshooting

### Common Issues

**1. "Amplify not configured" errors**
```bash
# Solution: Generate outputs after backend deployment
npx ampx generate outputs
```

**2. Authentication not working**
```bash
# Check if auth resource exists
amplify status

# If not, add authentication
amplify add auth
amplify push
```

**3. Todos not loading**
- Ensure you've deployed the API: `amplify push`
- Check browser console for errors
- Verify amplify_outputs.json exists

**4. Build errors about missing modules**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

Enable debug logging:
```typescript
// In main.ts, add before Amplify.configure():
import { ConsoleLogger } from 'aws-amplify/utils';
ConsoleLogger.LOG_LEVEL = 'DEBUG';
```

## 📚 Next Steps

### Production Deployment

1. **Configure Environment**:
```bash
amplify env add prod
amplify env checkout prod
amplify push
```

2. **Deploy Frontend**:
```bash
# Build for production
npm run build

# Deploy to Amplify Hosting
amplify add hosting
amplify publish
```

### Advanced Features

- **Add Multi-Factor Authentication (MFA)**
- **Implement Social Sign-in (Google, Facebook)**
- **Add Real-time Data with WebSockets**
- **Implement Push Notifications**
- **Add Analytics with Amazon Pinpoint**

## 🆘 Getting Help

- **AWS Amplify Documentation**: https://docs.amplify.aws/
- **Angular Documentation**: https://angular.dev/
- **Bootstrap Documentation**: https://getbootstrap.com/docs/
- **GitHub Issues**: [Create an issue for this template]

## 📄 License

This template is provided as-is for educational and commercial use. Modify as needed for your projects.

---

**Happy coding! 🚀** This template gives you a solid foundation to build amazing applications with Angular and AWS Amplify.
