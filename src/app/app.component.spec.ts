/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service.ts.old';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    // Create a mock for AuthService
    mockAuthService = {
      isAuthenticated$: of(false),
      currentUser$: of(null),
      logout: jasmine.createSpy('logout').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toEqual('ng-amplify-gen2-seed');
  });

  it('should have currentYear property set to current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toEqual(currentYear);
  });
});
