import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isSignDivVisiable: boolean = true;

  signUpObj: SignUpModel = new SignUpModel();
  loginObj: LoginModel = new LoginModel();

  constructor(private router: Router, private sharedService: SharedService) {}

  onRegister() {
    if (this.isValidSignUp()) {
      const localUser = localStorage.getItem('angular17users');
      if (localUser != null) {
        const users = JSON.parse(localUser);
        users.push(this.signUpObj);
        localStorage.setItem('angular17users', JSON.stringify(users));
      } else {
        const users = [];
        users.push(this.signUpObj);
        localStorage.setItem('angular17users', JSON.stringify(users));
      }
      alert('Registration Success');
    } else {
      alert('Please fill in all required fields.');
    }
  }

  isValidSignUp(): boolean {
    return !!this.signUpObj.name && !!this.signUpObj.state && !!this.signUpObj.gender && !!this.signUpObj.email && !!this.signUpObj.password;
  }

  onLogin() {
    const localUsers = localStorage.getItem('angular17users');
    if (localUsers != null) {
       const users = JSON.parse(localUsers);
       const isUserPresent = users.find((user: SignUpModel) => user.email == this.loginObj.email && user.password == this.loginObj.password);
       if (isUserPresent != undefined) {
         // Store the user's role in localStorage
         localStorage.setItem('userRole', isUserPresent.role);
         this.router.navigate(['/dashboard/allusers']);
         localStorage.setItem('loggedUser', JSON.stringify(isUserPresent));
         this.router.navigateByUrl('/dashboard/allusers');
       } else {
         alert("Either Password or Email is Incorrect");
       }
    }
   }
   

  onLogout() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login']);
    this.sharedService.logout();
  }
}

export class SignUpModel {
  name: string;
  state: string;
  gender: string;
  email: string;
  password: string;

  constructor() {
    this.name = '';
    this.state = '';
    this.gender = '';
    this.email = '';
    this.password = '';
  }
}

export class LoginModel {
  email: string;
  password: string;

  constructor() {
    this.email = "";
    this.password = "";
  }
}
