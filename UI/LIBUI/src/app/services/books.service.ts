import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { UsersService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  dev = true;

  readonly basicPath =
    'https://localhost:44340/api/books';

  private Books = [new Book(1, 'peter pen', 'local', 219, 'none'),
  new Book(2, 'robin hood', 'local', 182, 'none'),
  new Book(3, 'The Wave', 'martin', 221, 'none'),
  new Book(4, 'spongebob squarepants', 'patchi the priate', 78, 'none')]

  constructor(private toast:ToastrService,private httpClient: HttpClient, private usersService: UsersService) {
    // if (this.dev)
    //   console.log('need to connect to server...');
  }

  async getAllAvailableBooks(): Promise<Book[]> {
    return await firstValueFrom(this.httpClient.get(this.basicPath)) as any;
  }

  async borrowBook(bookId: number): Promise<'succesfull' | 'book taken' | 'cant find book' | 'unknown'> {
    let r: 'succesfull' | 'book taken' | 'cant find book' | 'unknown' = 'unknown';
    r = await firstValueFrom(this.httpClient.post(this.basicPath + '/borrow', {
      bookId
    }, {
      headers: {
        AuthToken: this.usersService.getUserToken()
      }
    })).then(resolve => {
      return 'succesfull';
    }, errors => {

      console.log('erros: ', errors);


      if (errors.error == 'need to login'){
        this.toast.info('You need to login','',{
          timeOut:2000,
          positionClass:'toast-top-center',
          closeButton:true,
        });
        this.usersService.goToLogin();
      }
      if (errors.error == 'Error: Book not found!')
        return 'cant find book';
      return errors.status < 300 ? 'succesfull' : 'unknown';
    }
    );
    return r;
  }

  async getBorrowedBooks(): Promise<Borrow[]> {
    let result: any = await firstValueFrom(this.httpClient.get(this.basicPath + '/borrows', {
      headers: {
        AuthToken: this.usersService.getUserToken()
      }
    }));
    return result;
  }

  async returnBook(borrowId: number) {
    let res = await firstValueFrom(this.httpClient.post(
      this.basicPath + '/ReturnBook',
      { borrowId },
      {
        headers: {
          AuthToken: this.usersService.getUserToken()
        }
      }
    )).then(resolve => {
      return true;
    }, error => {
      return error.status < 300
    });
    return res;
  }

  async addBook(book: BookModel) {
    let res = await firstValueFrom(this.httpClient.post(this.basicPath + '/addBook', book, {
      headers: {
        AuthToken: this.usersService.getUserToken()
      }
    })).then(res => {
      return true;
    }, error => {
      if (error.status < 300)
        return true;
      return false;
    });
    return res;
  }
}

export class BookModel {
  title?: string;
  author?: string;
  pages?: number;
  summary?: string;
  imgSrc: string = 'https://images.twinkl.co.uk/tr/image/upload/t_illustration/illustation/book.png';

  /**
   *
   */
  constructor(title: string, author: string, pages: number, summary: string, imgSrc: string) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.summary = summary;
    this.imgSrc = imgSrc.length > 2 ? imgSrc : this.imgSrc;
  }
}

export class Book {

  id: number;
  title: string;
  author: string;
  pages: number;
  summary: string;
  imgSrc: string = 'https://images.twinkl.co.uk/tr/image/upload/t_illustration/illustation/book.png';

  constructor(id: number, title: string, author: string, pages: number, summary: string, imgsrc: string = 'https://images.twinkl.co.uk/tr/image/upload/t_illustration/illustation/book.png') {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.summary = summary;
  }
}

export class Borrow {
  id?: number;
  book?: Book;
  borrowedDate?: string;
}
