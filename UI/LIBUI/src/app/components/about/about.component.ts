import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  showLoginScreen = false;
  showHomeScreen = false;
  showProfileScreen = false;
  showAdminScreen = false;

  constructor() { }

  ngOnInit(): void {
  }

  showLogin() {
    this.resetShows();
    this.showLoginScreen=true;
   }
  showHome() { 
    this.resetShows();
    this.showHomeScreen=true;
  }
  showProfile() { 
    this.resetShows();
    this.showProfileScreen=true;
  }
  showAdmin() { 
    this.resetShows();
    this.showAdminScreen=true;
  }

  resetShows() {
    this.showLoginScreen = false;
    this.showHomeScreen = false;
    this.showProfileScreen = false;
    this.showAdminScreen = false;
  }

}
