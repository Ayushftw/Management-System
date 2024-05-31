// blog.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BranchComponent } from './branch.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BranchComponent],
  imports: [
    CommonModule,
    MatSidenavModule, 
    MatIconModule, 
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,  
    RouterModule.forChild([
      { path: '', component: BranchComponent }
    ])
  ]
})
export class BranchModule { }
