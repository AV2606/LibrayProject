using BooksApi.Models.ApiModels;
using BooksApi.Rpositories;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

public class EmailHttpModel
{
    public string Email { get; set; }
}


namespace BooksApi.Controllers
{
    [ApiController]
    [Route("api/accounts")]
    public class AccountsController:Controller
    {
        private AccountsRepository accountRepo;

        public AccountsController(AccountsRepository accountsRepository)
        {
            this.accountRepo = accountsRepository;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpModel model)
        {
            /*
             * UserName: Admin
             * Password: Admin123!
             */

            /*
             * UserName: notAdmin
             * Password:Na123!
             */
            var response = await this.accountRepo.SignUpAsync(model);
            Console.WriteLine(response.passwordHash);

            if (response.result.Succeeded)
            {
                return Ok("You have signed in");
            }

            return Unauthorized(response.result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] SignInModel model)
        {
            /*
             * UserName: Admin
             * Password: Admin123!
             */
            var result = await accountRepo.LoginAsync(model);
            if (string.IsNullOrEmpty(result))
            {
                return Unauthorized();
            }
            return Ok(new { token=result });
        }

        [HttpGet("isAdmin")]
        public async Task<IActionResult> IsAdmin([FromHeader] string AuthToken)
        {
            var res = this.accountRepo.IsUserAdmin(AuthToken);

            return Ok(new { IsAdmin = res });
        }

        [HttpGet("getUserData")]
        public async Task<IActionResult> GetUserData([FromHeader] string AuthToken)
        {
            var user = this.accountRepo.GetUser(AuthToken);
            if(user is null)
                return NotFound();
            return Ok(new { name = user.UserName, mail = user.Email });
        }

        [HttpPatch("setmail")]
        public async Task<IActionResult> ChangeMail([FromHeader] string AuthToken, [FromBody] EmailHttpModel email)
        {
            var res=this.accountRepo.ChangeMail(AuthToken, email.Email);

            return res ? Ok("mail change to: " + email.Email) : BadRequest("Cant change the mail..");
        }

        [HttpGet("isLoggedIn")]
        public async Task<IActionResult> IsLoggedIn([FromHeader] string AuthToken)
        {
            var user=this.accountRepo.GetUser(AuthToken);
            if (user is null)
                return Unauthorized("need to login");
            return Ok("logged in!");
        }
    }
}
