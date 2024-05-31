// home.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule ,
    RouterModule.forChild([
      { path: '', component: HomeComponent }
    ])
  ]
})
export class HomeModule { }
