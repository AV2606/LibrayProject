using BooksApi.Models.ApiModels;
using BooksApi.Rpositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BooksApi.Controllers
{

    public class Book
    {
        public int BookId { get; set; }
    }

    public class Borrow
    {
        public int BorrowId { get; set; }
    }

    [ApiController]
    [Route("api/books")]
    public class BooksController : Controller
    {
        private BooksRepository booksRepo;
        private AccountsRepository accountsRepo;

        public BooksController(BooksRepository repo,AccountsRepository accountsRepository)
        {
            this.booksRepo = repo;
            this.accountsRepo = accountsRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            return Ok(booksRepo.GetAllBooks());
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetBooksByFilter([FromQuery]string filter)
        {
            return Ok(booksRepo.GetBooksWithFilter(filter));
        }

        [HttpPost("borrow")]
        public async Task<IActionResult> BorrowBook([FromHeader]string AuthToken, [FromBody] Book book)
        {
            var user = accountsRepo.GetUser(AuthToken);
            if (user is null)
                return Unauthorized("need to login");
            var status=booksRepo.BorrowBook(book.BookId, user);
            if (status.success)
                return Ok();
            return BadRequest(status.Errors);
        }

        [HttpPost("addBook")]
        public async Task<IActionResult> AddBook([FromHeader] string AuthToken, [FromBody]BookModel bookModel)
        {
            var isadmin=accountsRepo.IsUserAdmin(AuthToken);
            if (!isadmin)
                return Unauthorized("Only admins can add books");
            booksRepo.AddBook(bookModel);
            return Ok("Book added!");
        }

        [HttpGet("Borrows")]
        public async Task<IActionResult> GetBorrows([FromHeader] string AuthToken)
        {
            return Ok(this.booksRepo.OpenBorrows(AuthToken));
        }

        [HttpPost("ReturnBook")]
        public async Task<IActionResult> CloseBorrows([FromHeader] string AuthToken, [FromBody] Borrow borrow)
        {
            var ans = this.booksRepo.CloseBorrow(AuthToken, borrow.BorrowId);
            if (ans.success)
                return Ok($"Closed borrow : borrowId:{borrow.BorrowId}");
            return base.BadRequest(ans.errors);
        }
    }
}
