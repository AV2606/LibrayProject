import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { hasAny } from 'src/app/classes/Functions';
import { Book, BooksService } from 'src/app/services/books.service';
import { UsersService } from 'src/app/services/login.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  geners = ['romantic', 'horror'];
  selectedGeners = [];
  books: Book[]=[];
  filteredBooks: Book[];
  bookToShow: Book | undefined = undefined;
  popup: HTMLElement | null = null;

  constructor(private toast:ToastrService,private usersService: UsersService, private booksService: BooksService) {
    booksService.getAllAvailableBooks().then(resolve=>{
      this.books=resolve;
      this.filteredBooks=this.books;
    });
    this.filteredBooks = this.books;
    this.usersService.isUserLoggedIn().then(resolve => {
      if (resolve) { 
      }
      else
        this.usersService.goToLogin();
    })
  }

  ngOnInit(): void {
  }

  closeInfoPopUp(element: HTMLElement) {
    this.bookToShow = undefined;
    element.classList.add('hidden');
    this.popup = element;
  }

  showBookInfo(book: Book) {
    if (this.bookToShow)
      return;
    this.bookToShow = book;
    if (!this.popup)
      this.popup = document.getElementById('popup');
    this.popup?.classList.remove('hidden');
  }

  async borrowBook(bookId: number | undefined,title:string|undefined) {
    if (bookId == undefined)
      return;
   
      let ans = await this.booksService.borrowBook(bookId);
      if (ans == 'succesfull')
        this.toast.success(`borrowed ${title} succefully`,'Its your book now',{
          positionClass:'toast-top-center',
          timeOut:3500,
          closeButton:true
        });
        else if(ans=='cant find book')
        this.toast.error(`cant borrow ${title} because it doesnt exists`,'????',{
          positionClass:'toast-top-center',
          timeOut:3500,
          closeButton:true
        });
  }

  searchKeyPress(event: any, searchBar: HTMLInputElement) {
    if (event.key == 'Enter')
      this.filterBooks(searchBar.value);
  }

  filterBooks(str: string) {
    let filtered: Book[] = [];
    this.books.forEach(element => {
      if (element.author.indexOf(str) != -1 || element.title.indexOf(str) != -1)
        filtered.push(element);
    });
    this.filteredBooks = filtered;
  }

  resetBooks(searchBar: HTMLInputElement) {
    this.filteredBooks = this.books;
    searchBar.value = '';
  }

}
