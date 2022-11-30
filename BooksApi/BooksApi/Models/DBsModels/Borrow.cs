using System.ComponentModel.DataAnnotations;

namespace BooksApi.Models.DBsModels
{
    public class Borrow
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public Book Book { get; set; }
        [Required]
        public ApplicationUser Borrower { get; set; }
        [Required]
        public DateTime? BorrowedDate { get; set; }
        [Required]
        public bool? IsClosed { get; set; }
    }
}
