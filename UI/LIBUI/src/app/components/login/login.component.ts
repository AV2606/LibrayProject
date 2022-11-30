import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService, SignUpStatus, UserData } from 'src/app/services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  rememberMe: any = true;
  showMismatchPass = false;
  showInvalidPassword = false;
  showUsedUsername = false;
  showInvalidMail = false;
  showTakenMail = false;

  constructor(private toast: ToastrService, private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  async signIn(userName: any, password: any) {
    let ans = await this.usersService.Login(userName, password, this.rememberMe);
    console.log('ans:', ans);

    if (ans == false)
      document.getElementsByClassName('cant-sign-label')[0].classList.remove('hidden');
    else
      this.router.navigate(['home']);
  }

  isPasswordValid(passwrod: string) {
    if (passwrod.length < 6)
      return false;
    if (!this.hasAny('ABCDEFGHIJKLMNOPQRSTUVWXYZ', passwrod))
      return false;
    if (!this.hasAny('abcdefghijklmnopqrstuvwxyz', passwrod))
      return false;
    if (!this.hasAny('!@#$%^&*()_+=-/', passwrod))
      return false;
    if (!this.hasAny('0987654321', passwrod))
      return false;
    return true;
  }
  hasAny(charsToFind: string, findAt: string) {
    for (let i = 0; i < charsToFind.length; i++)
      if (findAt.indexOf(charsToFind[i]) != -1)
        return true;
    return false;
  }

  async signUp(username: any, email: string, pass1: any, pass2: any) {
    let signup = true;

    if (!email.toLocaleUpperCase().match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
      this.showInvalidMail = true;
      signup = false;
    }

    if (pass1 != pass2) {
      this.showMismatchPass = true;
      signup = false;
    }

    this.showInvalidPassword = !this.isPasswordValid(pass1);
    if (signup) {
      let s = await this.usersService.signUp(username, email, pass1);
      if (s.success)
        this.usersService.Login(username, pass1, false);
      else {
        this.toast.error(s.errors.error[0].description, s.errors.error[0].code, {
          timeOut: 3500,
          closeButton: true,
          positionClass: 'toast-top-center'
        })
      }
    }
  }

  /**
   * occurse when the sign in or ssign up clicked
   * @param element the sign up or sign in element.
   */
  signClick(element: HTMLElement, obsoleteEl: HTMLElement, relevantDiv: HTMLElement, obsoleteDiv: HTMLElement) {
    element.classList.add('active-sign');
    obsoleteEl.classList.remove('active-sign');

    relevantDiv.classList.remove('hidden');
    relevantDiv.classList.add('sign-div-active')
    obsoleteDiv.classList.add('hidden');
    obsoleteDiv.classList.remove('sign-div-active');
  }
}
