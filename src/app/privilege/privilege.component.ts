import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExtraService } from '../extra.service';
import { MatSnackBar } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.css']
})
export class PrivilegeComponent implements OnInit {
  privilegeForm: FormGroup;
  orgData: any[] = [];
  roles: string[] = ['Admin', 'Doctor', 'Agent'];
  userRole: string;   constructor(private formBuilder: FormBuilder, private extraService: ExtraService,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getOrgData();
    
    this.userRole = localStorage.getItem('userRole');
  }
  initializeForm(): void {
    this.privilegeForm = this.formBuilder.group({
      organization: ['', Validators.required],
      role: ['', Validators.required],
      userPrivileges: this.formBuilder.group({
        add: [false],
        edit: [false],
        delete: [false],
        view: [false]
      }),
      organizationPrivileges: this.formBuilder.group({
        add: [false],
        edit: [false],
        delete: [false],
        view: [false]
      }),
      branchPrivileges: this.formBuilder.group({
        add: [false],
        edit: [false],
        delete: [false],
        view: [false]
      }),
      productPrivileges: this.formBuilder.group({
        add: [false],
        edit: [false],
        delete: [false],
        view: [false]
      })
    });
 
           
   
    this.privilegeForm.get('organization').valueChanges.subscribe(selectedOrg => {
         this.updatePrivileges(selectedOrg, this.privilegeForm.get('role').value);
    });
    this.privilegeForm.get('role').valueChanges.subscribe(selectedRole => {
         this.updatePrivileges(this.privilegeForm.get('organization').value, selectedRole);
    });
   }
   

   updatePrivileges(selectedOrg: string, selectedRole: string): void {
    const existingPrivileges = this.getExistingPrivileges(selectedOrg, selectedRole);
    this.privilegeForm.get('userPrivileges').patchValue(existingPrivileges.userPrivileges || {});
    this.privilegeForm.get('organizationPrivileges').patchValue(existingPrivileges.organizationPrivileges || {});
    this.privilegeForm.get('branchPrivileges').patchValue(existingPrivileges.branchPrivileges || {});
    this.privilegeForm.get('productPrivileges').patchValue(existingPrivileges.productPrivileges || {});
}


getExistingPrivileges(selectedOrg: string, selectedRole: string): any {
  const privileges = JSON.parse(localStorage.getItem('privileges')) || {};
  if (privileges[selectedOrg] && privileges[selectedOrg][selectedRole]) {
      return privileges[selectedOrg][selectedRole];
  } else {
      return {
          userPrivileges: {},
          organizationPrivileges: {},
          branchPrivileges: {},
          productPrivileges: {}
      };
  }
}

  getOrgData(): void {
    this.orgData = this.extraService.getOrgData();
  }

  hasPrivilege(action: string): boolean {
    const userRole = localStorage.getItem('userRole');
   
    if (userRole === 'Doctor' || userRole === 'Agent') {
       return action === 'view';
    } else if (userRole === 'Admin') {
       return true;
    } else {
       return false;
    }
    
 }
  
 onSubmit(): void {
  const selectedOrg = this.privilegeForm.get('organization').value;
  const selectedRole = this.privilegeForm.get('role').value;
  // Directly capture the form values for user, organization, and branch privileges
  const selectedPrivileges = {
      userPrivileges: this.privilegeForm.get('userPrivileges').value,
      organizationPrivileges: this.privilegeForm.get('organizationPrivileges').value,
      branchPrivileges: this.privilegeForm.get('branchPrivileges').value,
      productPrivileges: this.privilegeForm.get('productPrivileges').value
  };
  
  let privileges = JSON.parse(localStorage.getItem('privileges')) || {};
  if (!privileges[selectedOrg]) {
      privileges[selectedOrg] = {};
  }
  privileges[selectedOrg][selectedRole] = selectedPrivileges;
  
  localStorage.setItem('privileges', JSON.stringify(privileges));
  this.snackBar.open('Privileges have been successfully provided.', 'Close', {
     duration: 3000, // Duration in milliseconds
     panelClass: ['notification-snackbar'] // Optional: Add a custom class for styling
  });
 
  // Reset the form to its initial state
  this.privilegeForm.reset({
     organization: '',
     role: '',
     userPrivileges: {
       add: false,
       edit: false,
       delete: false,
       view: false
     },
     organizationPrivileges: {
       add: false,
       edit: false,
       delete: false,
       view: false
     },
     branchPrivileges: {
       add: false,
       edit: false,
       delete: false,
       view: false
     },
     productPrivileges: {
       add: false,
       edit: false,
       delete: false,
       view: false
     }
     
  });
 }
 
   
   shouldDisableActions(): boolean {
    const userRole = localStorage.getItem('userRole');
   
    return userRole === 'Doctor' || userRole === 'Agent';
   }
 
   deletePrivileges(selectedOrg: string, selectedRole: string): void {
    let privileges = JSON.parse(localStorage.getItem('privileges')) || {};
   
    if (privileges[selectedOrg]) {
       // Set the privileges for the selected role to false
       privileges[selectedOrg][selectedRole] = {
         userPrivileges: { add: false, edit: false, delete: false, view: false },
         organizationPrivileges: { add: false, edit: false, delete: false, view: false },
         branchPrivileges: { add: false, edit: false, delete: false, view: false },
         productPrivileges: { add: false, edit: false, delete: false, view: false }
       };
   
       // If there are no more roles for the selected organization, remove the organization
       if (Object.keys(privileges[selectedOrg]).length === 1) {
         delete privileges[selectedOrg];
       }
    }
   
    localStorage.setItem('privileges', JSON.stringify(privileges));
   
    // Reset the form controls for user, organization, and branch privileges
    this.privilegeForm.get('userPrivileges').reset({
       add: false,
       edit: false,
       delete: false,
       view: false
    });
    this.privilegeForm.get('organizationPrivileges').reset({
       add: false,
       edit: false,
       delete: false,
       view: false
    });
    this.privilegeForm.get('branchPrivileges').reset({
       add: false,
       edit: false,
       delete: false,
       view: false
    });
    ;
    this.privilegeForm.get('productPrivileges').reset({
       add: false,
       edit: false,
       delete: false,
       view: false
    });
   }
   
   selectAllUsersAndPrivileges(checked: boolean) {
    const userPrivileges = this.privilegeForm.get('userPrivileges') as FormGroup;
    const organizationPrivileges = this.privilegeForm.get('organizationPrivileges') as FormGroup;
    const branchPrivileges = this.privilegeForm.get('branchPrivileges') as FormGroup;
    const productPrivileges = this.privilegeForm.get('productPrivileges') as FormGroup;

    // Select or unselect all checkboxes under userPrivileges
    Object.keys(userPrivileges.controls).forEach(key => {
      userPrivileges.get(key).setValue(checked);
    });

    // Select or unselect all checkboxes under organizationPrivileges
    Object.keys(organizationPrivileges.controls).forEach(key => {
      organizationPrivileges.get(key).setValue(checked);
    });

    // Select or unselect all checkboxes under branchPrivileges
    Object.keys(branchPrivileges.controls).forEach(key => {
      branchPrivileges.get(key).setValue(checked);
    });
    Object.keys(productPrivileges.controls).forEach(key => {
      productPrivileges.get(key).setValue(checked);
    });
 }



 
}
