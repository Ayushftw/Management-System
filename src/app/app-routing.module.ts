import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.gaurd';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { BlogComponent } from './blog/blog.component';






const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
     path: 'dashboard',
     component: DashboardComponent,
     canActivate: [AuthGuard], // Protect dashboard routes
     children: [
      { path: 'allusers', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) }, // Lazy-loaded Home module
       { path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule) }, // Lazy-loaded Contact module
       { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) }, 
       { path: 'organisation', loadChildren: () => import('./organisation/organisation.module').then(m => m.OrganisationModule) },
       { path: 'branch', loadChildren: () => import('./branch/branch.module').then(m => m.BranchModule) },
       { path: 'privilege', loadChildren: () => import('./privilege/privilege.module').then(m => m.PrivilegeModule) },
       { path: 'product', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
       { path: 'policies', loadChildren: () => import('./policies/policies.module').then(m => m.PoliciesModule) }
       
     ],
  },
  // Redirect to login page if no other routes match
  { path: '**', redirectTo: '/login' },
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule,],
  exports: [RouterModule]
})  
export class AppRoutingModule { }
