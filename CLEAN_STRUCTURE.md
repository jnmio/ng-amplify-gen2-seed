# Clean Angular Template with AWS Amplify Authentication

This is a clean, organized Angular template for building AWS cloud applications with proper authentication and security.

## Structure

```
src/app/
├── auth/                    # Protected components (require authentication)
│   ├── dashboard/          # Main authenticated dashboard
│   ├── todos/             # Todo management (secured)
│   ├── profile/           # User profile
│   └── settings/          # User settings
├── guards/                # Route guards for protection
│   └── auth.guard.ts      # Authentication guard
├── services/              # Application services
│   └── auth.service.ts    # Authentication service
├── landing/               # Public landing page
├── login/                 # Public login component
└── app.component.*        # Main app shell
```

## Security Features

### Authentication Guard
- All routes under `/auth` are protected by `AuthGuard`
- Automatically redirects unauthenticated users to login
- Maintains authentication state across page refreshes

### Route Protection
- **Public routes**: `/landing`, `/login`
- **Protected routes**: `/auth/*` (todos, profile, settings)
- Old routes like `/todo` redirect to `/auth/todos` for backwards compatibility

### Component Organization
- **Public components**: Landing page, login
- **Authenticated components**: All under `auth/` directory
- Clean separation of concerns

## Navigation

### Public Navigation
- Landing page with features and call-to-action
- Login/signup functionality
- Responsive design with Bootstrap 5

### Authenticated Navigation
- Dashboard with navigation sidebar
- User information display
- Secure logout functionality
- Protected todo management

## Authentication Flow

1. **Landing Page** (`/landing`) - Public welcome page
2. **Login** (`/login`) - AWS Amplify authentication
3. **Dashboard** (`/auth`) - Protected main area with:
   - Todo management (`/auth/todos`)
   - User profile (`/auth/profile`)
   - Settings (`/auth/settings`)

## Development

### Running the Application
```bash
npm start
```

### Building for Production
```bash
npm run build
```

### Authentication Setup
1. Deploy your Amplify backend
2. Run `npx ampx generate outputs` to generate the configuration
3. Authentication will be automatically configured

## Features

- ✅ Secure authentication with AWS Amplify
- ✅ Route-based access control
- ✅ Responsive Bootstrap 5 UI
- ✅ Clean component organization
- ✅ TypeScript support
- ✅ Modern Angular standalone components
- ✅ Proper error handling
- ✅ User session management

## Customization

This template provides a solid foundation for any AWS cloud application requiring authentication. You can:

1. **Add new protected components** under `src/app/auth/`
2. **Extend the dashboard** with additional navigation items
3. **Customize the landing page** for your specific use case
4. **Add more authentication features** like password reset, MFA, etc.
5. **Integrate additional AWS services** as needed

The structure ensures your authenticated features remain secure while providing a professional, clean interface for your users.
