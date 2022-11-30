import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Book, BookModel, BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  showAddBookPage = false;


  showTitleError = false;
  showAuthorError = false;
  showPageAmountError = false;
  showSummaryError = false;


  constructor(private toast:ToastrService,private booksService: BooksService) { }

  ngOnInit(): void {
  }

  showAddBook() {
    this.showAddBookPage = true;
  }

  async addBook(title: string, author: string, pages: string, summary: string, imgSource: string) {
    let book:BookModel=new BookModel(title,author,Number.parseInt(pages),summary,imgSource);
    let res=await this.booksService.addBook(book);
    if(res)
    {
      this.toast.success(`Added book ${title}`,'Book added succefully',{
        positionClass:'toast-top-center',
        timeOut:3000,
        closeButton:true
      })
    }
    else{
      this.toast.error(`cant add book ${title} try again later...`,'Failed to add book',{
        positionClass:'toast-top-center',
        timeOut:2777,
        closeButton:true
      })
    }
  }

}
