import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  // URLs that should be excluded from token injection
  private excludedUrls: string[] = [
    '/auth/',
    '/public/',
    'amazonaws.com',
    'amplifyapp.com'
  ];

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token injection for excluded URLs
    if (this.shouldExcludeUrl(request.url)) {
      return next.handle(request);
    }

    return this.authService.authState$.pipe(
      take(1),
      switchMap(authState => {
        if (authState.isAuthenticated) {
          return this.addTokenToRequest(request, next);
        } else {
          return next.handle(request);
        }
      })
    );
  }

  private addTokenToRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable(observer => {
      this.authService.getAccessToken().then(token => {
        if (token) {
          request = this.addAuthHeader(request, token);
        }

        next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              return this.handle401Error(request, next);
            }
            return throwError(() => error);
          })
        ).subscribe({
          next: (event) => observer.next(event),
          error: (error) => observer.error(error),
          complete: () => observer.complete()
        });
      }).catch(error => {
        console.error('Failed to get access token:', error);
        next.handle(request).subscribe({
          next: (event) => observer.next(event),
          error: (error) => observer.error(error),
          complete: () => observer.complete()
        });
      });
    });
  }

  private addAuthHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.refreshToken().pipe(
        switchMap((token: string) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          
          if (token) {
            return next.handle(this.addAuthHeader(request, token));
          } else {
            // Token refresh failed, redirect to login
            this.authService.signOut();
            return throwError(() => new Error('Token refresh failed'));
          }
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.signOut();
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      // If we're already refreshing, wait for the new token
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => {
          if (token) {
            return next.handle(this.addAuthHeader(request, token));
          } else {
            return throwError(() => new Error('Token refresh failed'));
          }
        })
      );
    }
  }

  private refreshToken(): Observable<string> {
    return new Observable(observer => {
      this.authService.refreshSession().then(() => {
        this.authService.getAccessToken().then(token => {
          observer.next(token || '');
          observer.complete();
        }).catch(error => {
          observer.error(error);
        });
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  private shouldExcludeUrl(url: string): boolean {
    return this.excludedUrls.some(excludedUrl => url.includes(excludedUrl));
  }
}
