
# ng-amplify-gen2-seed - AI Assistant Instructions

## Seed Template Overview
This repository is a **seed template** for all new AWS Amplify Gen2 full stack applications using Angular (TypeScript v19.2+). It comes pre-configured with everything needed to start building a modern, scalable app:

- **Angular 19.2+** frontend
- **AWS Amplify Gen2** backend (Cognito, AppSync/GraphQL, DynamoDB, S3)
- **Bootstrap 5.3** styling (with custom theme system)
- **Dual authentication** (standard users & advertisers)
- **AI-powered features** (Grok, DALL-E, Stripe integration)
- **Comprehensive service and component architecture**
- **Best practices for error handling, testing, and development workflows**

Use this template as the starting point for any new project requiring a robust, production-ready AWS Amplify Gen2 + Angular stack. All core patterns, services, and conventions are included and documented below.


## Key Architecture Patterns


### AWS Amplify Gen2 Integration
- **Backend definition**: `amplify/backend.ts` uses `defineBackend()` to compose auth, data, and storage resources
- **Amplify configuration**: Auto-configured in `main.ts` and `app.component.ts` using `amplify_outputs.json`
- **Data access**: Use `generateClient<Schema>()` pattern from `aws-amplify/data` (see services)
- **Auth pattern**: All auth operations use `getCurrentUser()` from `@aws-amplify/auth`, not the UI library


### Dual Authentication System
Supports two distinct user types with separate authentication flows:

#### Standard User Authentication
- Route pattern: `/dashboard`, `/games`, `/admin`
- Service: `AuthGuard` → `UserProfileService`
- Models: `UserProfile`, `GameScore`, `grokQuery`, `UserAIUsage`
- Storage: Standard Cognito user pool

#### Advertiser Authentication  
- Route pattern: `/advertiser/*` (login, dashboard, campaigns)
- Service: `AdvertiserAuthGuard` → `AdvertiserAuthService`
- Models: `Advertiser`, `AdvertiserUser`, `AdCampaign`, `AdCreative`
- Features: Campaign management, AI campaign generation, budget tracking


### Component Architecture Standards
All components follow standardized patterns (see `help-files/COMPONENT_STANDARDIZATION.md`):
```html
<div class="component-container [component-name]">
  <div class="component-content">
    <!-- Content using Bootstrap 5.3 grid -->
  </div>
</div>
```


### Theme System (Critical)
**Never use Bootstrap CSS variables** - use theme service variables instead:
- `var(--bg-primary)`, `var(--text-primary)` for backgrounds/text
- `var(--accent-primary)` for interactive elements
- Import `standard-component.css` for consistent theming
- Theme service managed via `ThemeService` in services/


## Core Services Architecture

### Authentication Services
- **`AuthGuard`**: Protects standard user routes
- **`AdvertiserAuthGuard`**: Protects advertiser routes (`/advertiser/*`)
- **`AdvertiserAuthService`**: Manages advertiser authentication, registration, profile loading
- **`UserProfileService`**: Manages standard user profiles and initialization

### Campaign Management Services
- **`CampaignService`**: CRUD operations for ad campaigns, budget management
- **`AiCampaignGeneratorService`**: Grok AI integration for campaign content generation
- **`AiImageGeneratorService`**: DALL-E integration for campaign image generation
- **`AdvertiserDashboardService`**: Analytics and performance tracking for advertisers

### AI & Content Services
- **`GrokApiService`**: Core Grok AI integration for chat and content generation
- **`GroqApiService`**: Alternative AI provider integration
- **`StripeService`**: Payment processing and subscription management
- **`ThemeService`**: Application-wide theme management


## Data Models & Schema

### Core User Models
```typescript
// Standard Users
UserProfile: { userId, email, name, subscription, tokens }
GameScore: { userId, game, score, timestamp }
grokQuery: { userId, query, response, tokens }
UserAIUsage: { userId, tokensUsed, resetDate }

// Advertiser Models  
Advertiser: { businessName, email, phone, address, website }
AdvertiserUser: { advertiserId, userId, email, role, permissions }
AdCampaign: { advertiserId, name, budget, startDate, endDate, status }
AdCreative: { campaignId, type, content, imageUrl, performance }
```

### Key Schema Patterns
- **Secondary Indexes**: Models use GSIs for efficient querying (e.g., `byAdvertiserId`)
- **Relationship Management**: Foreign keys link related entities (advertiserId, userId, campaignId)
- **Status Tracking**: Enum fields for campaign status, creative approval, etc.


## Application Structure

### Route Organization
```
/ (root)
├── /dashboard (standard users)
├── /games/* (gaming features)
├── /admin/* (admin panel)
└── /advertiser/* (advertiser platform)
    ├── /login
    ├── /dashboard  
    ├── /campaigns/*
    └── /profile
```

### Component Organization
```
src/app/
├── components/ (shared components)
├── services/ (all services)
├── advertiser/ (advertiser-specific components)
│   ├── advertiser-login/
│   ├── advertiser-dashboard/
│   ├── campaign-wizard/
│   └── advertiser-profile/
├── games/ (game components)
├── admin/ (admin components)
└── shared/ (reusable components)
```


## Development Workflows

### Running the Application
```bash
npm start                    # Development server (ng serve)
npm run start:test          # Test mode with auth bypass
npm run build               # Production build  
npm test                    # Run tests
npm run audit:components    # Find unused components
```

### Testing & Debugging
- **Test Dashboard**: `/test-dashboard` - bypass authentication for testing
- **User Switcher**: Simulate different user roles without Cognito
- **Route Testing**: Systematic testing of all application routes
- **Mock Services**: Test environment with `MockAuthService` and `TestAuthGuard`

### Amplify Gen2 Development
```bash
# Limit usage due to AWS costs - only run when necessary
npx ampx sandbox    # Local development environment
```


## Terminal & Development Server Limitations

### AI Assistant Terminal Monitoring Issues
**CRITICAL LIMITATION**: The AI assistant has limited ability to monitor long-running terminal processes like `ng serve`. 

**Problems:**
- Cannot reliably track build completion status
- May report "finished" when build is still in progress
- Cannot see real-time terminal output from background processes

**Solutions:**
1. **Manual Server Management**: User should start `ng serve` manually and monitor build completion
2. **Status Verification**: Always check browser console and terminal output manually
3. **Build Completion**: Wait for "Compiled successfully" message before testing
4. **Error Checking**: Use `get_errors` tool for compilation issues, not terminal monitoring

### Recommended Development Workflow
```bash
# User runs manually:
npm start                    # Start dev server
# Wait for "Compiled successfully" message
# Then test application at http://localhost:4200
```

**AI Assistant Role:**
- File editing and code generation only
- Error checking via `get_errors` tool
- Code compilation verification
- **NOT**: Terminal process monitoring or build status tracking


## Campaign Management Features

### AI Campaign Generation
- **Wizard Flow**: 6-step campaign creation process
- **AI Integration**: Grok generates campaign names, descriptions, ad copy
- **Image Generation**: DALL-E creates campaign visuals
- **Budget Management**: Automated daily budget calculations
- **Form Validation**: Comprehensive validation with user-friendly error messages

### Campaign Analytics
- **Performance Tracking**: Impressions, clicks, conversions
- **Budget Monitoring**: Spend tracking and alerts
- **ROI Calculation**: Automated return on investment metrics
- **Reporting**: Exportable campaign performance reports


## Project-Specific Conventions

### File Organization
- **Components**: Feature-based organization with clear separation
- **Services**: Reactive patterns with BehaviorSubjects for state management
- **Guards**: Route protection with proper error handling and logging
- **Dev files**: Experimental components in `dev-save/` (excluded from routes)

### Bootstrap 5.3 Integration
- Application uses Bootstrap 5.3 grid system exclusively
- Custom `standard-component.css` provides Bootstrap-compliant base classes
- Mobile-first responsive design with proper breakpoint management
- Never mix custom grid systems with Bootstrap classes

### Error Handling & Logging
- **Console Logging**: Comprehensive logging with emoji prefixes for easy identification
- **Error States**: Proper error handling in all async operations
- **User Feedback**: Toast notifications and inline error messages
- **Debug Mode**: Enhanced logging available via environment configuration


## Integration Points

### External APIs
- **Grok AI**: Campaign content generation, chat responses
- **DALL-E**: Campaign image generation
- **Stripe**: Payment processing and subscription management
- **AWS Services**: Cognito, AppSync, DynamoDB, S3

### Security Implementation
- **Route Guards**: Multi-layer protection for different user types
- **Token Validation**: Proper JWT handling for authenticated requests
- **CORS Configuration**: Proper API access control
- **Input Validation**: Client and server-side validation


## Critical Notes for AI Development

1. **Dual Auth System**: Always specify which authentication system (standard vs advertiser)
2. **Theme Variables**: Use `var(--bg-primary)` etc., never Bootstrap CSS variables
3. **Service Patterns**: Use reactive patterns with proper subscription management
4. **Route Protection**: Apply appropriate guards based on user type
5. **Error Handling**: Include comprehensive error handling and user feedback
6. **Bootstrap Usage**: Use 5.3 grid system with `standard-component.css`
7. **Testing**: Use test dashboard and mock services for development
8. **AWS Costs**: Be mindful of Amplify sandbox usage due to costs


## Environment Configuration

### Development Environments
- **Standard**: Full authentication with AWS backend
- **Test**: Bypassed authentication with mock services (`environment.test.ts`)
- **Production**: Optimized build with full security enabled

### Feature Flags
- **AI Features**: Can be toggled via environment variables
- **Debug Logging**: Enhanced logging for development/troubleshooting
- **Test Mode**: Authentication bypass for testing workflows


## Help Documentation
Extensive project documentation available in `help-files/` including:
- `COMPONENT_STANDARDIZATION.md` - Component patterns and conventions
- `BOOTSTRAP_IMPLEMENTATION_SUMMARY.md` - Grid system usage and examples
- `SECURITY_IMPLEMENTATION.md` - Authentication and authorization patterns
- `AI_CAMPAIGN_IMPLEMENTATION_SUMMARY.md` - Campaign management workflows
- `CLEANUP_ACTION_PLAN.md` - Code maintenance and optimization
- `COMPREHENSIVE_USER_MANAGEMENT_COMPLETE.md` - User management patterns


## Quick Reference Commands

### Authentication Testing
```typescript
// Check standard user auth
this.authService.isAuthenticated$

// Check advertiser auth  
this.advertiserAuth.isAuthenticated$

// Get current user (either type)
getCurrentUser() // from @aws-amplify/auth
```

### Common Component Patterns
```typescript
// Standard component with theme
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  constructor(public themeService: ThemeService) {}
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Service Integration
```typescript
// Campaign service example
constructor(private campaignService: CampaignService) {}

// AI generation example  
constructor(private aiGenerator: AiCampaignGeneratorService) {}
```

This comprehensive guide ensures proper development patterns and maintains consistency across the entire application ecosystem.