import { Component, OnInit, ViewChild } from '@angular/core';
import { hasAny } from 'src/app/classes/Functions';
import { showToast } from 'src/app/classes/Toast';
import { BooksService, Borrow } from 'src/app/services/books.service';
import { UsersService } from 'src/app/services/login.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  showChangePass = false;
  showIncorrectOldPass = false;
  showPassNotTheSame = false;

  showEditMail = false;
  showInvalidMail = false;

  showEditName = true;
  showInvalidName = false;
  invalidNameText = 'Invalid name';

  showBorrowsPage = false;


  mail: string | undefined = 'example@mail.com';
  fname: string | undefined = 'avichay vaknin';
  borrows: Borrow[] = [];

  constructor(private toastr:ToastrService,private UsersService: UsersService, private booksService: BooksService) {
    this.getInfo();
    this.resetIndicators();
    UsersService.isUserLoggedIn().then(resolve => {
      if (!resolve)
        UsersService.goToLogin();
    })
    this.booksService.getBorrowedBooks().then(resolve => {
      this.borrows = resolve;
      console.log(resolve[0]);
    })
  }


  ngOnInit(): void {
  }

  getDate(date: string | undefined) {
    if (typeof date === 'undefined')
      return 'someTime';
    let newDate = new Date(date);
    return newDate.toLocaleDateString('en-il', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
  }

  async returnBook(BorrowId: number | undefined, button: HTMLButtonElement,title='no title') {
    if (typeof BorrowId === 'undefined')
      return;
    let res = await this.booksService.returnBook(BorrowId);
    console.log(res);
    
    if (res) {
      console.log('get in');
      this.toastr.info('book returned',title,{
        positionClass:'toast-top-center',
        timeOut:5000,
        closeButton:true,
      });
      button.classList.remove('btn-outline-success');
      button.classList.add('disable');
      button.classList.add('btn-outline-secondary');
      button.innerText = 'book returned';
      button.disabled = true;
      this.booksService.getBorrowedBooks().then(resolve=>{
        this.borrows=resolve;
      })
    }

    else{
      this.toastr.error('uknown error, try again later...','error returning book',{
        positionClass:'toast-top-center',
        timeOut:5000,
        closeButton:true,
      });
    }

  }

  getInfo() {
    this.UsersService.getUser().then((resolve) => {
      this.mail = resolve?.email;
      this.fname = resolve?.name;
    })
  }

  async logOut() {
    this.UsersService.logOut();
    this.UsersService.goToLogin();
    this.toastr.warning('You\'ve been logged out, log in to continue','Log Out',{
      positionClass:'toast-top-center',
      timeOut:3755,
      closeButton:true
    })
  }

  resetIndicators() {
    this.showChangePass = false;
    this.showIncorrectOldPass = false;
    this.showPassNotTheSame = false;

    this.showEditMail = false;
    this.showInvalidMail = false;

    this.showEditName = false;
    this.showInvalidName = false;
    this.invalidNameText = 'Invalid name';

    this.showBorrowsPage = false;
  }

  showSeeMore() {
    this.resetIndicators();
    this.showBorrowsPage = true;
  }

  showChangeName() {
    this.resetIndicators();
    this.showEditName = false;
  }

  showChangeMail() {
    this.resetIndicators();
    this.showEditMail = true;
  }
  showChangePassword() {
    this.resetIndicators();
    this.showChangePass = true;
  }

  showContactSupport() {
    this.resetIndicators();
    this.toastr.info('','coming soon...',{
      closeButton:true,
      positionClass:'toast-top-center',
      timeOut:2500
    })
  }

  async changeName(newname: string) {
    if (hasAny(newname, '1234567890-=!@#$%^&*()_+[]{}<>?\'\\/":;*|')) {
      this.showInvalidName = true;
      if (hasAny(newname, ' ') == false) {
        this.showInvalidName = true;
        this.invalidNameText += ', forgot last name?'
      }
      return;
    }
    else {
      let ans = await this.UsersService.setName(newname);
      this.fname = (await this.UsersService.getUser())?.name;

      showToast({
        text: ans
      });
    }
  }

  async changeMail(newmail: string) {
    if (newmail.toLocaleUpperCase().match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
      this.showInvalidMail = false;
      let ans = await this.UsersService.setMail(newmail);
      console.log(ans);

      if (ans == 'success') {
        this.mail = (await this.UsersService.getUser())?.email;
        console.log(this.mail);

       this.toastr.success(`new mail: ${newmail}`,'mail changed succesfuly',
       {
        positionClass:'toast-top-center',
        closeButton:true,
        timeOut:3500
       });
       this.getInfo();
      }
    }
    else {
      this.showInvalidMail = true;
    }
  }

  async changePassword(oldpass: string, newpass1: string, newpass2: string) {
    if (newpass1 != newpass2) {
      this.showPassNotTheSame = true;
      return;
    }
    let ans = await this.UsersService.changePassword(oldpass, newpass1);
    this.toastr.success('','Password changed succefully',{
      timeOut:3000
    });
  }

}
