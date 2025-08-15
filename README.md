# ng-amplify-gen2-seed

Angular TS AWS Amplify Generation 2 with bootstrap starter template.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.15.

## Development server

To start a local development server, run:


# ng-amplify-gen2-seed

## Overview

**ng-amplify-gen2-seed** is a comprehensive seed template for building new AWS Amplify Gen2 full stack applications with Angular (TypeScript v19.2+). It provides everything needed to start a modern, scalable app, including:

- Angular 19.2+ frontend
- AWS Amplify Gen2 backend (Cognito, AppSync/GraphQL, DynamoDB, S3)
- Bootstrap 5.3 styling with a custom theme system
- Dual authentication (standard users & advertisers)
- AI-powered features (Grok, DALL-E, Stripe integration)
- Comprehensive service and component architecture
- Best practices for error handling, testing, and development workflows

Use this template as the foundation for any new project requiring a robust, production-ready AWS Amplify Gen2 + Angular stack.

---

## Features

- **Dual Authentication:** Supports both standard users and advertisers with separate flows and route protection.
- **AI Campaign Management:** Grok AI and DALL-E integration for ad campaign generation and analytics.
- **Bootstrap 5.3:** Responsive grid system and theming via custom CSS variables.
- **Comprehensive Architecture:** Modular services, guards, and reusable components.
- **Testing & Debugging:** Test dashboard, mock services, and enhanced logging.
- **Amplify Gen2 Integration:** Backend defined in `amplify/backend.ts`, auto-configured frontend, and secure data access.

---

## Getting Started Tutorial

Follow these steps to create your own app based on this seed template:

### 1. Clone the Repository
```powershell
git clone https://github.com/jnmio/ng-amplify-gen2-seed.git
cd ng-amplify-gen2-seed
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Configure AWS Amplify Backend
- Edit `amplify/backend.ts` to define your resources (auth, data, storage).
- Use `npx ampx sandbox` for local Amplify development (limit usage to avoid AWS costs).

### 4. Start the Development Server
```powershell
npm start
# Then open http://localhost:4200
```

### 5. Customize Components & Services
- Follow patterns in `src/app/components/` and `src/app/services/`.
- Use Bootstrap grid and theme variables (`var(--bg-primary)`, etc.).
- Reference `help-files/COMPONENT_STANDARDIZATION.md` for best practices.

### 6. Add Features
- Implement new models in `amplify/backend/data/resource.ts`.
- Extend authentication, campaign management, or AI features as needed.

### 7. Test & Debug
- Use `/test-dashboard` for authentication bypass and testing.
- Run `npm test` for unit tests.
- Use enhanced logging and error handling for troubleshooting.

---

## Project Structure

```
/amplify         # Amplify Gen2 backend (auth, data, storage)
/src/app         # Angular app (components, services, guards)
/public          # Static assets
amplify_outputs.json  # Amplify frontend config
angular.json     # Angular workspace config
package.json     # Project dependencies
```

---

## Documentation & Help

- See `help-files/` for detailed guides on component patterns, Bootstrap usage, security, AI campaign management, and more.
- For Angular CLI help: [Angular CLI Overview and Command Reference](https://angular.io/cli)

---

## License

This template is provided as a starting point for your own projects. See LICENSE for details.
