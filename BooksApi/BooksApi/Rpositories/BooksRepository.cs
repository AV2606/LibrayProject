using BooksApi.Models;
using BooksApi.Models.ApiModels;
using BooksApi.Models.DBsModels;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace BooksApi.Rpositories
{
    public class BooksRepository
    {
        private BooksDbContext context;
        private AccountsRepository accountsRepo;

        public BooksRepository(BooksDbContext context,AccountsRepository accountsRepository)
        {
            this.context = context;
            this.accountsRepo = accountsRepository;
            this.context.Database.EnsureCreated();
        }

        public List<Book> GetAllBooks()
        {
            return context.Books.ToList();
        }

        public List<Book> GetBooksWithFilter(string filter)
        {
            filter = filter.ToLower();
            var function = new Func<Book, bool>((b) =>
            {
                var r = false;
                if (b.Author is not null)
                    r = r || b.Author.ToLower().Contains(filter);
                if (b.Title is not null)
                    r = r || b.Title.ToLower().Contains(filter);
                if (b.Summary is not null)
                    r = r || b.Summary.ToLower().Contains(filter);
                return r || (b.Pages + "" == filter);
            });
            return context.Books.Where( function
            ).ToList();
        }

        public (bool success, string[] Errors) BorrowBook(int bookId,ApplicationUser user)
        {
            var success = false;
            var errors = new List<string>();


            var books = context.Books.Where(b => b.Id == bookId).ToList();
            //var borrows=context.Borrows.Where(b => b.Book.Id==bookId&&b.IsClosed==false);

            if (books.Count() < 1)
                errors.Add("Error: Book not found!");
            //if (borrows.Count() > 0)
            //    errors.Add("Error: Book is already borrowed!");
            Borrow borrow = new Borrow() {
                Book = books.ElementAt(0),
                BorrowedDate = DateTime.Now,
                Borrower = user,
                IsClosed = false
            };
            context.Entry(borrow).State=EntityState.Added;
            var n=context.SaveChanges();

            success = true;

            return (success, errors.ToArray());
        }

        public void AddBook(BookModel model)
        {
            var book = new Book() {
                Author = model.Author,
                ImgSrc=model.ImgSrc,
                Pages= model.Pages,
                Summary=model.Summary,
                Title=model.Title
            };
            context.Books.Add(book);
            context.SaveChangesAsync();
        }

        public Borrow[] OpenBorrows(string token)
        {
            var user=this.accountsRepo.GetUser(token);
            if (user is null)
                return null;

            var raw = this.context.Borrows.Where(b => b.Borrower.Id == user.Id && b.IsClosed==false).Include(b => b.Borrower).Include(b => b.Book);
            var r = raw.ToArray();
            return r;
        }
        public (bool success, string[] errors) CloseBorrow(string token,int BorrowId)
        {

            var open = OpenBorrows(token);
            var borrow = open.Where(b => b.Id == BorrowId).ToList();

            if (borrow.Count < 1)
                return (false, new string[] { "Cant find borrow, maybe its already closed." });

            borrow[0].IsClosed = true;
            context.Entry(borrow[0]).State = EntityState.Modified;
            context.SaveChangesAsync();
            return (true, new string[0]);
        }
    }
}
