// blog.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoliciesComponent } from './policies.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [PoliciesComponent],
  imports: [
    CommonModule,
    MatSidenavModule, 
    MatIconModule, 
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,  
    HttpClientModule,
    RouterModule.forChild([
      { path: '', component: PoliciesComponent }
    ])
  ]
})
export class PoliciesModule { }
