
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrivilegeComponent } from './privilege.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FormsModule } from '@angular/forms';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@NgModule({
  declarations: [PrivilegeComponent],
  imports: [
    CommonModule,
    MatSidenavModule, // Add this line
    MatIconModule, 
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: PrivilegeComponent }
    ])
  ]
})
export class PrivilegeModule { }
