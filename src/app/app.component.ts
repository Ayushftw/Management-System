import { Component, OnInit } from '@angular/core';
import { ApplicationRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoading: boolean = true; 

  constructor(private appRef: ApplicationRef) {}

  ngOnInit() {
    setTimeout(() => {
      // After the operation completes, hide the loader
      this.isLoading = false;
      
      this.appRef.tick();
    }, 2000); // Wait for 2 seconds
  }
}
