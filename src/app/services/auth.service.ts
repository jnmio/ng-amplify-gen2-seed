import { Injectable, signal, computed, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, from, throwError, timer } from 'rxjs';
import { map, catchError, switchMap, take } from 'rxjs/operators';
import { 
  signIn, 
  signOut, 
  signUp, 
  confirmSignUp, 
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  getCurrentUser,
  fetchAuthSession,
  SignInInput,
  SignUpInput,
  SignUpOutput
} from '@aws-amplify/auth';
import { AuthUser } from '@aws-amplify/auth';
// import { ErrorHandlerService } from '../services/error-handler.service';
// import { LoadingService } from '../services/loading.service';

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  sessionExpiry: Date | null;
}

@Injectable({
  providedIn: 'root'
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


  // Reactive state using Angular signals
  private authStateSignal = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
    sessionExpiry: null
  });

  // Computed values
  readonly isAuthenticated = computed(() => this.authStateSignal().isAuthenticated);
  readonly currentUser = computed(() => this.authStateSignal().user);
  readonly isLoading = computed(() => this.authStateSignal().isLoading);
  readonly error = computed(() => this.authStateSignal().error);

  // Observable for reactive programming compatibility
  private authStateSubject = new BehaviorSubject<AuthState>(this.authStateSignal());
  public readonly authState$ = this.authStateSubject.asObservable();

  // Session refresh timer
  private sessionRefreshTimer?: any;
  
  // Initialization promise to ensure auth state is loaded before navigation
  private initializationPromise: Promise<void> | null = null;
  private isInitialized = false;

  constructor(
    private router: Router
  ) {
    // Start initialization but don't wait for it in constructor
    this.checkAuthStatus();
    this.initializationPromise = this.initializeAuth();
    this.setupSessionRefresh();
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
   * Wait for authentication initialization to complete
   */
  async waitForInitialization(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }
    
    if (this.initializationPromise) {
      await this.initializationPromise;
    }
    
    return Promise.resolve();
  }

  /**
   * Initialize authentication state
   */
  private async initializeAuth(): Promise<void> {
    try {
      console.log('🔄 AuthService: Initializing authentication state...');
      this.setLoading(true);
      const user = await getCurrentUser();
      
      if (user) {
        await this.updateAuthState(true, user);
        await this.checkSessionExpiry();
        console.log('✅ AuthService: User authenticated', { userId: user.userId });
      } else {
        await this.updateAuthState(false, null);
        console.log('❌ AuthService: No authenticated user');
      }
    } catch (error) {
      console.log('🔓 AuthService: No authenticated user found');
      await this.updateAuthState(false, null);
    } finally {
      this.setLoading(false);
      this.isInitialized = true;
      console.log('🏁 AuthService: Initialization complete');
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(credentials: SignInInput): Promise<void> {
    try {
      this.setLoading(true);
      const result = await signIn(credentials);

      if (result.isSignedIn) {
        const user = await getCurrentUser();
        await this.updateAuthState(true, user);
        await this.setupSessionRefresh();
        
        // Navigate to dashboard or return URL
        const returnUrl = this.getReturnUrl();
        this.router.navigate([returnUrl]);
      } else {
        // Handle multi-step sign-in (MFA, etc.)
        this.handleSignInNextStep(result.nextStep);
      }
    } catch (error: any) {
      this.handleAuthError(error, 'Sign In');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      this.setLoading(true);
      await signOut();
      await this.updateAuthState(false, null);
      this.clearSessionTimer();
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.handleAuthError(error, 'Sign Out');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Sign up new user
   */
  async signUp(userDetails: SignUpInput): Promise<SignUpOutput> {
    try {
      this.setLoading(true);
      const result = await signUp(userDetails);
      
      if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        // Handle confirmation step
        return result;
      }
      
      return result;
    } catch (error: any) {
      this.handleAuthError(error, 'Sign Up');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Confirm sign up with code
   */
  async confirmSignUp(username: string, confirmationCode: string): Promise<void> {
    try {
      this.setLoading(true);
      await confirmSignUp({ username, confirmationCode });
    } catch (error: any) {
      this.handleAuthError(error, 'Confirm Sign Up');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Resend confirmation code
   */
  async resendConfirmationCode(username: string): Promise<void> {
    try {
      await resendSignUpCode({ username });
    } catch (error: any) {
      this.handleAuthError(error, 'Resend Code');
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(username: string): Promise<void> {
    try {
      this.setLoading(true);
      await resetPassword({ username });
    } catch (error: any) {
      this.handleAuthError(error, 'Reset Password');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(username: string, confirmationCode: string, newPassword: string): Promise<void> {
    try {
      this.setLoading(true);
      await confirmResetPassword({ username, confirmationCode, newPassword });
    } catch (error: any) {
      this.handleAuthError(error, 'Confirm Password Reset');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Refresh authentication session
   */
  async refreshSession(): Promise<void> {
    try {
      const session = await fetchAuthSession();
      
      if (session.tokens) {
        const user = await getCurrentUser();
        await this.updateAuthState(true, user);
        await this.checkSessionExpiry();
      } else {
        await this.updateAuthState(false, null);
      }
    } catch (error: any) {
      console.error('Session refresh failed:', error);
      await this.updateAuthState(false, null);
      throw error;
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() || null;
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUser();
    if (!user) return false;

    // Extract roles from user attributes or groups
    const userGroups = (user as any).groups || [];
    const userRoles = (user as any).attributes?.['custom:roles']?.split(',') || [];
    
    return userGroups.includes(role) || userRoles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Update authentication state
   */
  private async updateAuthState(isAuthenticated: boolean, user: AuthUser | null): Promise<void> {
    const newState: AuthState = {
      isAuthenticated,
      user,
      isLoading: this.authStateSignal().isLoading,
      error: null,
      sessionExpiry: isAuthenticated ? await this.getSessionExpiry() : null
    };

    this.authStateSignal.set(newState);
    this.authStateSubject.next(newState);
  }

  /**
   * Set loading state
   */
  private setLoading(isLoading: boolean): void {
    const currentState = this.authStateSignal();
    this.authStateSignal.set({ ...currentState, isLoading });
    this.authStateSubject.next(this.authStateSignal());
  }

  /**
   * Set error state
   */
  private setError(error: string | null): void {
    const currentState = this.authStateSignal();
    this.authStateSignal.set({ ...currentState, error });
    this.authStateSubject.next(this.authStateSignal());
  }

  /**
   * Manually check authentication state (useful for synchronizing with external auth changes)
   */
  async checkAuthenticationState(): Promise<void> {
    try {
      const user = await getCurrentUser();
      
      if (user) {
        console.log('🔄 Auth state check: User is authenticated');
        await this.updateAuthState(true, user);
        await this.checkSessionExpiry();
      } else {
        console.log('🔄 Auth state check: User is not authenticated');
        await this.updateAuthState(false, null);
      }
    } catch (error) {
      console.log('🔄 Auth state check: No authenticated user found');
      await this.updateAuthState(false, null);
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: any, operation: string): void {
    console.error(`${operation} error:`, error);
    
    let userMessage = 'An unexpected error occurred. Please try again.';
    
    switch (error.name || error.code) {
      case 'UserNotConfirmedException':
        userMessage = 'Please confirm your email address before signing in.';
        break;
      case 'NotAuthorizedException':
        userMessage = 'Invalid email or password.';
        break;
      case 'UserNotFoundException':
        userMessage = 'No account found with this email address.';
        break;
      case 'TooManyRequestsException':
        userMessage = 'Too many failed attempts. Please try again later.';
        break;
      case 'LimitExceededException':
        userMessage = 'Attempt limit exceeded. Please try again later.';
        break;
    }

    this.setError(userMessage);
    // TODO: Integrate with global error handler when available
    console.error(`${operation}: ${userMessage}`);
  }

  /**
   * Handle multi-step sign-in process
   */
  private handleSignInNextStep(nextStep: any): void {
    switch (nextStep?.signInStep) {
      case 'CONFIRM_SIGN_UP':
        this.router.navigate(['/auth/confirm'], { queryParams: { step: 'signup' } });
        break;
      case 'RESET_PASSWORD':
        this.router.navigate(['/auth/reset-password']);
        break;
      case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
        this.router.navigate(['/auth/new-password']);
        break;
      default:
        console.log('Unhandled sign-in step:', nextStep);
        break;
    }
  }

  /**
   * Setup automatic session refresh
   */
  private async setupSessionRefresh(): Promise<void> {
    this.clearSessionTimer();

    // Refresh session every 45 minutes
    this.sessionRefreshTimer = timer(0, 45 * 60 * 1000).subscribe(async () => {
      try {
        await this.refreshSession();
      } catch (error) {
        console.error('Automatic session refresh failed:', error);
        // If refresh fails, user might need to re-authenticate
        await this.signOut();
      }
    });
  }

  /**
   * Clear session refresh timer
   */
  private clearSessionTimer(): void {
    if (this.sessionRefreshTimer) {
      this.sessionRefreshTimer.unsubscribe();
      this.sessionRefreshTimer = undefined;
    }
  }

  /**
   * Check session expiry and warn user
   */
  private async checkSessionExpiry(): Promise<void> {
    try {
      const expiry = await this.getSessionExpiry();
      if (expiry) {
        const timeUntilExpiry = expiry.getTime() - Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (timeUntilExpiry <= fiveMinutes && timeUntilExpiry > 0) {
          console.warn('Session will expire soon. Please save your work.');
          // TODO: Integrate with notification service
        }
      }
    } catch (error) {
      console.error('Failed to check session expiry:', error);
    }
  }

  /**
   * Get session expiry time
   */
  private async getSessionExpiry(): Promise<Date | null> {
    try {
      const session = await fetchAuthSession();
      const expiry = session.tokens?.accessToken?.payload?.exp;
      return expiry ? new Date(expiry * 1000) : null;
    } catch (error) {
      console.error('Failed to get session expiry:', error);
      return null;
    }
  }

  /**
   * Get return URL from storage or default
   */
  private getReturnUrl(): string {
    const returnUrl = sessionStorage.getItem('returnUrl');
    sessionStorage.removeItem('returnUrl');
    return returnUrl || '/dashboard';
  }

  /**
   * Set return URL for after authentication
   */
  setReturnUrl(url: string): void {
    sessionStorage.setItem('returnUrl', url);
  }

  /**
   * Clear authentication state (for testing)
   */
  async clearAuthState(): Promise<void> {
    await this.updateAuthState(false, null);
    this.clearSessionTimer();
  }
}
