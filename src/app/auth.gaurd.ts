import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if user is authenticated (e.g., by checking local storage or authentication service)
    const isLoggedIn = localStorage.getItem('loggedUser');

    if (isLoggedIn) {
      return true; // Allow access to the route
    } else {
      this.router.navigate(['/login']);
      return false;
  }
}
}