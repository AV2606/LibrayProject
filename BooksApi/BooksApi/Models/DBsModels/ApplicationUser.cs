using Microsoft.AspNetCore.Identity;

namespace BooksApi.Models.DBsModels
{
    public class ApplicationUser : IdentityUser
    {
        public bool IsAdmin { get; set; }
    }
}
