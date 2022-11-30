import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsersService } from 'src/app/services/login.service';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  lastActiveEl: any;
  showAdmin = false;

  constructor(private usersService: UsersService) {
    let show = () => {
      usersService.isCurrentUserAdmin().then(resolve => {
        this.showAdmin = resolve;
      });
    }
    show();
    usersService.addUserChangeEventListener(show);
  }

  ngOnInit(): void {
  }

  btnClick(element: any) {
  }
}
