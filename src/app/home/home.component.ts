import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { ExtraService } from '../extra.service';
import { HttpClient } from '@angular/common/http';

@Component({
 selector: 'app-home',
 templateUrl: './home.component.html',
 styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 userData: any[] = []; 
 orgData: any[] = [];
 showAddUserForm: boolean = false;
 newUser: any = {};
 showEditUserForm: boolean = false;
 selectedUser: any;
 editUserForm: FormGroup;
 addUserForm: FormGroup;
 searchQuery: string = '';
 
 states: string[] = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry'];

 constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private extraService: ExtraService,private http: HttpClient) { }

 
 ngOnInit(): void {

  
  this.fetchUsers();
    const orgDataStr = localStorage.getItem('angular17orgs');
    if (orgDataStr) {
       this.orgData = JSON.parse(orgDataStr);
    }
    
    this.addUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      state: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required] ,
      password: ['', Validators.required],
      organization: ['', Validators.required]
    });
    
    this.editUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      state: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', Validators.required],
      organization: ['', Validators.required]
    });

  
    const userDataStr = localStorage.getItem('angular17users');
    if (userDataStr) {
      this.userData = JSON.parse(userDataStr);
    }
 }
 get filteredUsers() {
  if (!this.searchQuery) {
    return this.userData;
  }

  const filtered = this.userData.filter(user =>
    user.name && user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
  );

  return filtered;
}
 currentPage: number = 1;
pageSize: number = 10;

get totalPages(): number {
 return Math.ceil(this.filteredUsers.length / this.pageSize);
}

get startIndex(): number {
 return (this.currentPage - 1) * this.pageSize;
}

get endIndex(): number {
 return Math.min(this.startIndex + this.pageSize, this.filteredUsers.length);
}

get paginatedUsers(): any[] {
 const startIndex = (this.currentPage - 1) * this.pageSize;
 const endIndex = Math.min(startIndex + this.pageSize, this.filteredUsers.length);
 return this.filteredUsers.slice(startIndex, endIndex);
}

goToPage(page: number): void {
 if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
 }

  const searchInput = document.querySelector('.search-input');
 searchInput.addEventListener('input', () => {
   this.currentPage = 1; 
 }); 

}


nextPage(): void {
 if (this.currentPage < this.totalPages) {
    this.currentPage++;
 }
}

previousPage(): void {
 if (this.currentPage > 1) {
    this.currentPage--;
 }
}
getPageNumbers(): number[] {
  const pageNumbers: number[] = [];
  for (let i = 1; i <= this.totalPages; i++) {
     pageNumbers.push(i);
  }
  return pageNumbers;
 }



 fetchUsers(): void {
  this.http.get<any>('https://dummyjson.com/users').subscribe(data => {
     console.log(data);
     let fetchedUsers = [];
     if (Array.isArray(data.users)) {
       fetchedUsers = data.users;/*.slice(0, 10);*/  
       fetchedUsers.forEach(user => {
         user.name = `${user.firstName} ${user.lastName}`;
       });
     } else {
       console.error('Unexpected data structure:', data);
     }
     const newUsers = fetchedUsers.filter(newUser => {
      const lowerCaseEmail = newUser.email.toLowerCase();
      // Check if the user already exists in this.userData
      return !this.userData.some(existingUser => existingUser.email.toLowerCase() === lowerCaseEmail);
    });

     
     this.userData = [...this.userData, ...newUsers];
     localStorage.setItem('angular17users', JSON.stringify(this.userData));
  }, error => {
     console.error('Error fetching users:', error);
  });
  
  
  
}



 removeUser(index: number): void {
    const confirmation = confirm("Are you sure you want to delete this user?");
    if (confirmation) {
      let users = JSON.parse(localStorage.getItem('angular17users')) || [];
      users.splice(index, 1);
      localStorage.setItem('angular17users', JSON.stringify(users));
      this.userData = users;

      this.snackBar.open('User deleted successfully!', 'Close', {
        duration: 2000
      });
    }
 }

 openAddUserForm(): void {
    this.showAddUserForm = true;
 }

 closeAddUserForm(): void {
    this.showAddUserForm = false;
 }

 saveUser(): void {
    if (this.addUserForm.invalid) {
      return;
    }
  
    const newUser = this.addUserForm.value;
    newUser.organization = newUser.organization ;

    let users = JSON.parse(localStorage.getItem('angular17users')) || [];
    users.push(newUser);
    localStorage.setItem('angular17users', JSON.stringify(users));
    this.userData = users;
    this.showAddUserForm = false;
    this.addUserForm.reset();

    this.snackBar.open('User added successfully!', 'Close', {
      duration: 2000
    });
 }

 editUser(index: number): void {
    this.selectedUser = this.userData[index];
    this.editUserForm.patchValue({
      name: this.selectedUser.name,
      state: this.selectedUser.state,
      gender: this.selectedUser.gender,
      email: this.selectedUser.email,
      role: this.selectedUser.role,
      password: this.selectedUser.password,
      organization: this.selectedUser.organization 
    });
    this.showEditUserForm = true;
 }

 saveEditedUser(): void {
    if (this.editUserForm.invalid) {
      return;
    } 
    this.selectedUser.name = this.editUserForm.value.name;
    this.selectedUser.state = this.editUserForm.value.state;
    this.selectedUser.gender = this.editUserForm.value.gender;
    this.selectedUser.email = this.editUserForm.value.email;
    this.selectedUser.role = this.editUserForm.value.role;
    this.selectedUser.password = this.editUserForm.value.password; 
    this.selectedUser.organization = this.editUserForm.value.organization;
  
    this.userData[this.userData.indexOf(this.selectedUser)] = this.selectedUser;
    localStorage.setItem('angular17users', JSON.stringify(this.userData));
  
    this.selectedUser = null;
    this.showEditUserForm = false;

    this.snackBar.open('User records Edited successfully!', 'Close', {
      duration: 2000
    });
 }Users

 closeEditUserForm(): void {
    this.selectedUser = null;
    this.showEditUserForm = false;
 }
 emptyUsersArray(): void {
  localStorage.setItem('angular17users', JSON.stringify([]));
  this.userData = []; // Also clear the userData array in your component
 }
 
 get startingId(): number {
  // Calculate the starting ID for the current page
  return (this.currentPage - 1) * this.pageSize + 1;
 }
 
 canPerformAction(action: string): boolean {
  const userRole = localStorage.getItem('userRole');
  const privileges = JSON.parse(localStorage.getItem('privileges')) || {};
 
 
  // Iterate over the organizations in the privileges object
  for (const organization in privileges) {
     const organizationPrivileges = privileges[organization];
     // Check if the current organization has the user's role
     if (organizationPrivileges.hasOwnProperty(userRole)) {
       const rolePrivileges = organizationPrivileges[userRole];
       // Check if the role has the specified action and if it's true
       if (rolePrivileges.hasOwnProperty(action) && rolePrivileges[action] === true) {
         console.log('User Role:', userRole);
         console.log('User Organization:', organization);
         console.log('Role Privileges:', rolePrivileges);
         return true; // The user has the privilege
       }
     }
  }
 
  console.log('User does not have the privilege for action:', action);
  return false;
 }
 
 
}