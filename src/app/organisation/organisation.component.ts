import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtraService } from '../extra.service';
@Component({
 selector: 'app-organisation',
 templateUrl: './organisation.component.html',
 styleUrls: ['./organisation.component.css']
})
export class OrganisationComponent implements OnInit {
  
 orgData: any[] = []; 
 showAddOrgForm: boolean = false;
 showEditOrgForm: boolean = false;
 selectedOrg: any;
 addOrgForm: FormGroup;
 editOrgForm: FormGroup;
 searchQuery: string = ''; 
 
 constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private extraservice: ExtraService) { }
 
 ngOnInit(): void {
     this.initializeForms();
     this.loadOrgData();
     this.extraservice.setOrgData(this.orgData);
}
 initializeForms(): void {
   this.addOrgForm = this.formBuilder.group({
       name: ['', Validators.required],
       address: ['', Validators.required],
       orgType: ['', Validators.required] ,
       phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
   });

   this.editOrgForm = this.formBuilder.group({
       name: ['', Validators.required],
       address: ['', Validators.required],
       orgType: ['', Validators.required],
       phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]] 
   });
}

get filteredOrgs() {
   if (!this.searchQuery) {
     return this.orgData;
   }
   return this.orgData.filter(org => org.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
}

 
 loadOrgData(): void {
     const orgDataStr = localStorage.getItem('angular17orgs');
     if (orgDataStr) {
       this.orgData = JSON.parse(orgDataStr);
     }
 }

 addOrganization(): void {
    const newOrg = this.addOrgForm.value;
    this.orgData.push(newOrg);
    this.saveOrgData();
    this.toggleAddOrgForm();

    this.snackBar.open('Organization added successfully', 'Close', { duration: 3000 });
 }

 updateOrganization(): void {
    const updatedOrg = this.editOrgForm.value;
    const index = this.orgData.findIndex(org => org.id === updatedOrg.id);
    if (index !== -1) {
      this.orgData[index] = updatedOrg;
      this.saveOrgData();
    }
    this.toggleEditOrgForm();

    this.snackBar.open('Organization updated successfully', 'Close', { duration: 3000 });
 }

 saveOrgData(): void {
    localStorage.setItem('angular17orgs', JSON.stringify(this.orgData));
 }

 toggleAddOrgForm(): void {
    this.showAddOrgForm = !this.showAddOrgForm;
 }

 toggleEditOrgForm(): void {
    this.showEditOrgForm = !this.showEditOrgForm;
 }

 editOrg(index: number): void {
  
  this.selectedOrg = this.orgData[index];
 
  
  this.editOrgForm.setValue({
     name: this.selectedOrg.name,
     address: this.selectedOrg.address,
     orgType: this.selectedOrg.orgType,
     phoneNumber: this.selectedOrg.phoneNumber

     
  });
 
  this.toggleEditOrgForm();
 }
 closeEditOrgForm(): void {
  this.showEditOrgForm = false;
 }
 closeAddOrgForm(): void {
  this.showAddOrgForm = false;
  this.addOrgForm.reset();
}
showModal: boolean = false; 

toggleModal(): void {
 this.showModal = !this.showModal;
}

removeOrg(index: number): void {
   if (window.confirm('Are you sure you want to delete this organization?')) {
      this.orgData.splice(index, 1);
      this.saveOrgData();
      
      this.snackBar.open('Organization deleted successfully', 'Close', { duration: 3000 });
   }
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
        // Check if the role has the specified action under branchPrivileges and if it's true
        if (rolePrivileges.hasOwnProperty('organizationPrivileges') && rolePrivileges.organizationPrivileges.hasOwnProperty(action) && rolePrivileges.organizationPrivileges[action] === true) {
          console.log('User Role:', userRole);
          console.log('User Organization:', organization);
          console.log('Role Privileges:', rolePrivileges);
          return true; // The user has the privilege
        }
      }
   }
   return false; // The user does not have the privilege
  }
}
