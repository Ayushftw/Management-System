
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {  OrganisationComponent  } from './organisation.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FormsModule } from '@angular/forms';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@NgModule({
  declarations: [OrganisationComponent],
  imports: [
    CommonModule,
    MatSidenavModule, // Add this line
    MatIconModule, 
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: OrganisationComponent }
    ])
  ]
})
export class OrganisationModule { }
