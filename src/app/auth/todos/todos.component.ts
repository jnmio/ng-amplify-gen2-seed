/**
 * Todos Component (Protected)
 * 
 * This component manages todo items for authenticated users.
 * It demonstrates AWS Amplify DataStore integration and provides
 * a complete CRUD (Create, Read, Update, Delete) interface.
 * 
 * Key Features:
 * - Secure access (only authenticated users can access)
 * - Real-time data synchronization with AWS DynamoDB
 * - User-friendly interface with Bootstrap styling
 * - Error handling for backend configuration issues
 * - Loading states and user feedback
 * 
 * AWS Amplify Integration:
 * - Uses generateClient() to create a typed data client
 * - Connects to DynamoDB through Amplify's data layer
 * - Handles authentication automatically via Amplify auth
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import { AuthService } from '../../services/auth.service';

// Schema type definition
// In a real application, this would import from amplify/data/resource
// For this template, we use 'any' for flexibility during setup
type Schema = any;

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    CommonModule // Provides *ngIf, *ngFor, date pipe, etc.
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
  // Array to store todo items
  todos: any[] = [];
  
  // Flag to track if Amplify backend is properly configured
  amplifyConfigured = false;
  
  // Current authenticated user information
  currentUser: any = null;
  
  // AWS Amplify data client for interacting with the backend
  private client = generateClient<Schema>();

  constructor(private authService: AuthService) {}

  /**
   * Component initialization
   * 
   * Sets up user subscription, checks backend configuration,
   * and loads initial todo data.
   */
  ngOnInit(): void {
    // Subscribe to current user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Check if Amplify backend is configured
    this.checkAmplifyConfiguration();
    
    // Load initial todos
    this.listTodos();
  }

  /**
   * Check Amplify Configuration
   * 
   * Verifies that the Amplify backend is properly set up and
   * the data client can access the Todo model.
   */
  checkAmplifyConfiguration() {
    try {
      // Generate a new client instance
      this.client = generateClient<Schema>();
      
      // Check if the client has the Todo model available
      this.amplifyConfigured = !!(this.client && this.client.models && this.client.models['Todo']);
    } catch (error) {
      console.error('Error generating Amplify client:', error);
      this.amplifyConfigured = false;
    }
    
    // Log warning if not configured
    if (!this.amplifyConfigured) {
      console.warn('Amplify data client not properly configured. Please run "npx ampx generate outputs" after deploying your backend.');
    }
  }

  /**
   * Load todos from the backend
   * 
   * Fetches all todo items for the current user from AWS DynamoDB
   * through the Amplify data layer.
   */
  async listTodos() {
    // Only proceed if backend is configured
    if (!this.amplifyConfigured) {
      return;
    }
    
    try {
      // Query the backend for todos
      // The {} parameter is for query options (filters, pagination, etc.)
      const { data: items } = await this.client.models['Todo']['list']({});
      
      // Update the local todos array
      this.todos = items || [];
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  /**
   * Create a new todo
   * 
   * Prompts user for todo content and creates a new item in the backend.
   * Uses window.prompt for simplicity - in production, use a proper form.
   */
  async createTodo() {
    // Check backend configuration
    if (!this.amplifyConfigured) {
      alert('Todo functionality is not available. Amplify backend needs to be configured.');
      return;
    }

    try {
      // Get todo content from user
      // In production, replace with a proper form or modal
      const content = window.prompt('Todo content');
      
      if (content) {
        // Create new todo in backend
        await this.client.models['Todo']['create']({
          content: content,
        });
        
        // Refresh the todo list to show the new item
        this.listTodos();
      }
    } catch (error) {
      console.error('error creating todos', error);
    }
  }

  /**
   * Delete a todo
   * 
   * Removes a todo item from the backend by its ID.
   * 
   * @param id - The unique identifier of the todo to delete
   */
  async deleteTodo(id: string) {
    // Check backend configuration
    if (!this.amplifyConfigured) {
      return;
    }

    try {
      // Delete the todo from backend
      await this.client.models['Todo']['delete']({ id });
      
      // Refresh the todo list to reflect the deletion
      this.listTodos();
    } catch (error) {
      console.error('error deleting todo', error);
    }
  }

  /**
   * Track function for *ngFor performance optimization
   * 
   * Helps Angular track todo items efficiently when the list changes.
   * This prevents unnecessary DOM re-renders.
   * 
   * @param index - The index of the item in the array
   * @param todo - The todo item object
   * @returns The unique identifier for the todo
   */
  trackByTodoId(index: number, todo: any): string {
    return todo.id;
  }
}
