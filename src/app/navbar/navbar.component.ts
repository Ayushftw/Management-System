  import { Component, OnInit, ViewChild } from '@angular/core';
  import { SharedService } from '../shared.service';
  import { MatDialog } from '@angular/material/dialog';
  import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
  import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'; 

  @Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
  })
  export class NavbarComponent implements OnInit {
    isSidenavOpened = true;
    isCustomerSubmenuOpen = false; 
    activeRoute: string; 

    constructor(private sharedService: SharedService,private dialog: MatDialog, private router: Router, private route: ActivatedRoute) {this.activeRoute = this.router.url; }
    onLogout() {
      this.sharedService.logout(); // Call the logout method from the service
    }
    
    ngOnInit() {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.activeRoute = this.router.url;
        }
      });
    
      }
      openProfileDialog(): void {
        const userData = JSON.parse(localStorage.getItem('loggedUser'));
        const dialogRef = this.dialog.open(ProfileDialogComponent, {
          width: '500px',
          data: userData
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
  }
  toggleCustomerSubmenu(): void {
    this.isCustomerSubmenuOpen = !this.isCustomerSubmenuOpen;
  }
  }
