import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private router: Router) { }

  logout(): void {
    // Clear user data from local storage
    localStorage.removeItem('loggedUser');
    
    // Navigate to the login page
    this.router.navigate(['/login']);
  }
}
