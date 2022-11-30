import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  readonly basicPath = 'https://localhost:44340/api/accounts/';

  isDev = false;

  private users: User[] = [{ userName: 'av', password: '123456', isAdmin: true, email: 'mail@example.com' }]
  private readonly token = 'token';
  userChange: Function[] = [];

  constructor(private router: Router, private httpClient: HttpClient) {

    console.log('ive been contructed');

    if (this.isDev) {
      //console.log('remember to make real values');
      //sessionStorage.setItem(this.token, 'av');
    }
  }


  goToLogin() {
    this.router.navigate(['login']);
    console.log('login');
  }

  addUserChangeEventListener(callback: Function) {
    this.userChange.push(callback);
  }

  private async invokeUserChangeEvent() {
    this.userChange.forEach(element => {
      try {
        element();
      }
      catch (error) {
        console.log(error);

      }
    });
  }


  /**
   * tries to log in the user and stores its credentials for further use
   * @param userName the user name
   * @param password the password
   * @returns true if the user was able to log in, false otherwise.
   */
  async Login(userName: string, password: string, remember = false, triggerUserChangeEvent = true) {

    let r = false;

    await firstValueFrom(this.httpClient.post(this.basicPath + "login", { UserName: userName, Password: password })).then(resolve => {
      r = true;
      console.log('resolve is:', resolve);

      if (remember) {
        localStorage.setItem(this.token, (resolve as any).token);
        sessionStorage.removeItem(this.token);
      }
      else {
        sessionStorage.setItem(this.token, (resolve as any).token);
        localStorage.removeItem(this.token);
      }

      if (triggerUserChangeEvent)
        this.invokeUserChangeEvent();
    }, error => {
      console.log("error occured: ", error);

    })
    console.log('r is: ', r);
    return r;
  }

  async logOut() {
    sessionStorage.setItem(this.token, '');
    localStorage.setItem(this.token, '');
    this.invokeUserChangeEvent();
  }

  getUserToken() {
    let sess = sessionStorage.getItem(this.token);
    let local = localStorage.getItem(this.token);
    if (sess && sess != '')
      return sess;
    if (local && local != '')
      return local;
    return '';//dev
  }

  /**
   * sets the token of the currently logged in user.
   * @param newtoken the new token to sign.
   */
  private setUserToken(newtoken: string) {
    if (sessionStorage.getItem(this.token))
      sessionStorage.setItem(this.token, newtoken);
    else
      localStorage.setItem(this.token, newtoken);
    this.invokeUserChangeEvent();
  }

  async isUserLoggedIn() {
    let stoken = sessionStorage.getItem(this.token);
    let ltoken = localStorage.getItem(this.token);

    let res1 = false;
    if (ltoken != null && ltoken != '') {
      res1 = await firstValueFrom(this.httpClient.get(this.basicPath + 'isLoggedIn', {
        headers: {
          AuthToken: ltoken
        }
      })).then(resolve => {
        return true;
      }, error => {
        //for some reason it fires the error all the time..
        return error.status < 300
      })
    }
    let res2 = false;
    if (!res1 && (stoken != null && stoken != '')) {
      res2 = await firstValueFrom(this.httpClient.get(this.basicPath + 'isLoggedIn', {
        headers: {
          AuthToken: stoken
        }
      })).then(resolve => {
        return true;
      }, error => {
        return error.status < 300;
      })
    }
    let r = res1 || res2;
    return r;
  }

  async isCurrentUserAdmin() {
    let t = await this.getUserToken();
    // let u: User | undefined = undefined;
    // this.users.forEach(element => {
    //   if (element.userName == t)
    //     u = element;
    // });
    // if (u === undefined)
    //   return false;
    // return (u as any).isAdmin;

    let r = false;
    await firstValueFrom(this.httpClient.get(this.basicPath + "isAdmin", {
      headers: {
        AuthToken: t ? t : "a"//empty string couses errors
      }
    })).then(resolve => {
      
      r = (resolve as any)["isAdmin"];
    }, error => console.log("error occured: ", error)
    );
    return r;
  }

  async signUp(username: string, email: string, password: string) {
    let r = { success: false, errors:(0 as any) };

    await firstValueFrom(this.httpClient.post(this.basicPath + "signup", {
      UserName: username,
      Email: email,
      Password: password,
      ConfirmPassword: password
    })).then(async resolve => {
      let res = await this.Login(username, password);
      r.success = res;
    }, errors => {
      r = { success: errors.status<300, errors: errors }
    })

    return r;
  }

  async changePassword(oldpass: string, newpass: string): Promise<'succes' | 'unknown fail' | 'incorrect password' | 'user not logged in'> {
    // const u = await this.getUser();
    // if (u == undefined)
    //   return 'user not logged in';
    // if (await this.isPassword(oldpass) == false)
    //   return 'incorrect password';
    // let us = this.users.find((element) => {
    //   return element.userName == u.name;
    // });
    // if (us)
    //   us.password = newpass;
    // else
    //   return 'unknown fail'
    // if (us.password != newpass)
    //   return 'unknown fail';
    // return 'succes';
    return 'unknown fail';//api
  }

  async isPassword(pass: string) {
    let r = false;
    // this.users.forEach(element => {
    //   if (element.userName == this.getUserToken() && element.password == pass)
    //     r = true;
    // });
    //not used..
    return r;
  }

  async getUser(): Promise<{ name: string, email: string } | undefined> {
    const t = this.getUserToken();

    // if (t == 'demo') {
    //   return new UserData('avichay vaknin', 'mail@example.com');
    // }
    // let r = undefined;
    // this.users.forEach(element => {
    //   if (t == element.userName)
    //     r = new UserData(element.userName, element.email);
    // });
    let r = undefined;
    await firstValueFrom(this.httpClient.get(this.basicPath + "getUserData", {
      headers: {
        AuthToken: t
      }
    })).then((resolve: any) => {
      r = { name: resolve.name, email: resolve.mail };
    })
    return r;
  }

  private async getUserRef(): Promise<User | undefined> {
    const t = this.getUserToken();

    // if (t == 'demo') {
    //   return {
    //     userName: 'avichay vaknin',
    //     password: '123456',
    //     email: 'example@email.com',
    //     isAdmin: true
    //   };
    // }
    // let r = undefined;
    // this.users.forEach(element => {
    //   if (t == element.userName)
    //     r = element
    // });
    // return r;
    return undefined
  }

  async setName(newName: string): Promise<'success' | 'unknown error' | 'user not signed in'> {
    // let user = await this.getUserRef();
    // console.log(user);

    // let r: 'success' | 'unknown error' | 'user not signed in' = 'unknown error';
    // if (user != undefined) {
    //   user.userName = newName;
    //   this.setUserToken(newName);

    //   r = 'success';
    // }
    // else {
    //   r = 'user not signed in';
    // }
    // return r;
    return 'unknown error';//api
  }

  async setMail(newmail: string) {
    let r = 'unknown error';
    // await this.getUserRef().then((resolve) => {
    //   if (resolve) {
    //     resolve.email = newmail;
    //     r = 'success';
    //   }
    //   else {
    //     r = 'user not signed in';
    //   }
    // });
    // console.log(
    //   (await this.getUser())?.email);
    await firstValueFrom(this.httpClient.patch(this.basicPath + "setmail", {
      Email: newmail
    }, {
      headers: {
        AuthToken: this.getUserToken()
      }
    })).then(resolve => {
      r = 'success';
    }, error => {
      r = error.status > 300 ? 'error' : 'success';
      console.log(error);
    })
    return r;
  }

}

export interface SignUpStatus {
  isEmailGood: boolean,
  isUserNameGood: boolean,
}

export class UserData {
  public name: string;
  public email: string;

  constructor(name: string, mail: string) {
    this.name = name;
    this.email = mail;
  }
}

export interface User {
  userName: string,
  password: string,
  email: string,
  isAdmin?: boolean
}
