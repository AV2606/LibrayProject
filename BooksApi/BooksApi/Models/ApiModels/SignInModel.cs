using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BooksApi.Models.ApiModels
{
    public class SignInModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
