using BooksApi.Models;
using BooksApi.Models.ApiModels;
using BooksApi.Models.DBsModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BooksApi.Rpositories
{

    public class AccountsRepository
    {
        private readonly BooksDbContext booksContext;
        private readonly UserManager<ApplicationUser> manager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IConfiguration configuration;

        private static Dictionary<string,ApplicationUser> tokensUsers=new Dictionary<string,ApplicationUser>();

        public AccountsRepository(UserManager<ApplicationUser> manager,
            BooksDbContext booksDbContext,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration)
        {
            this.booksContext = booksDbContext;
            this.manager = manager;
            this.signInManager = signInManager;
            this.configuration = configuration;

        }

        /// <summary>
        /// Signs up the user.
        /// </summary>
        /// <param name="signUp">The sign up model of the needed information</param>
        /// <returns></returns>
        public async Task<(IdentityResult result,string passwordHash)> SignUpAsync(SignUpModel signUp)
        {
            var user = new ApplicationUser()
            {
                Email = signUp.Email,
                UserName = signUp.UserName
            };

            var users = this.booksContext.Users.Where(u => u.Email == signUp.Email).ToList();
            if (users.Count > 0)
                return (IdentityResult.Failed(new IdentityError() { Code = "Duplicate Emails", Description = "This email is already being used." }), manager.PasswordHasher.HashPassword(user, signUp.Password));

            return (await manager.CreateAsync(user, signUp.Password),manager.PasswordHasher.HashPassword(user,signUp.Password));
        }

        /// <summary>
        /// Logins the user, and gives it a jwt token to use.
        /// </summary>
        /// <param name="signIn">The relevant inforamtion needed</param>
        /// <returns></returns>
        public async Task<string?> LoginAsync(SignInModel signIn)
        {
            var result = await signInManager.PasswordSignInAsync(signIn.UserName, signIn.Password, false, false);
            var users=booksContext.Users.Where(au => au.UserName == signIn.UserName).ToList();
            ApplicationUser? user = null;
            try
            {
                user = users.ElementAt(0);
            }
            catch(Exception ex)
            {
                return null;
            }
            if (!result.Succeeded)
            {
                return null;
            }
            var myClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name,signIn.UserName),
                new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
            };
            var authSignKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["JWT:Secret"]));
            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssue"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.UtcNow.AddDays(1),
                claims: myClaims,
                signingCredentials: new SigningCredentials(authSignKey, SecurityAlgorithms.HmacSha256Signature)
                );
            var stringToken=new  JwtSecurityTokenHandler().WriteToken(token);
            tokensUsers.Add(stringToken, user);
            //booksContext.UserTokens.Add(new IdentityUserToken<string>() { UserId = users.ElementAt(0).Id, Name="JWT", Value=stringToken, LoginProvider="app" });
            //booksContext.SaveChangesAsync();
            return stringToken;
        }

        public bool ChangeMail(string authToken, string email)
        {
            var user = GetUser(authToken);
            if (user is null)
                return false;
            user.Email = email;
            user.NormalizedEmail = email.ToUpper();
            booksContext.Entry(user).State = EntityState.Modified;
            booksContext.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Indicates whether the user is an admin or not.
        /// </summary>
        /// <param name="token">The token of the signed in user.</param>
        /// <returns></returns>
        public bool IsUserAdmin(string token)
        {
            if(tokensUsers.TryGetValue(token, out var user))
            {
                return user.IsAdmin;
            }
            return false;
        }

        /// <summary>
        /// Retrives the user by its token, retrives null if the user cant be found.
        /// </summary>
        /// <param name="token">The token of the signed in user.</param>
        /// <returns></returns>
        public ApplicationUser? GetUser(string token)
        {
            if(tokensUsers.TryGetValue(token,out var user))
            {
                return user;
            }
            return null;
        }

        private (bool success, string[] errors) changeAdminStatus(string token,string userId,bool newStatus)
        {
            var success = false;
            var errors = new List<string>();

            var u = this.booksContext.Users.Where(u => u.Id == userId).ToList();

            if (u.Count < 1)
            {
                errors.Add("User not found");
                return (success, errors.ToArray());
            }

            if (this.IsUserAdmin(token))
            {

                var user = u[0];

                user.IsAdmin = newStatus;
                this.booksContext.Entry(user).State = EntityState.Modified;
                this.booksContext.SaveChanges();

                success = true;

                return (success, errors.ToArray());
            }

            errors.Add("User asked is not admin");
            return (success, errors.ToArray());
        }

        /// <summary>
        /// Sets the user as admin, only admins can do that.
        /// </summary>
        /// <param name="token">The token of the user admin that asks the opration.</param>
        /// <param name="userId">The id of the user to adminifiy.</param>
        public (bool success, string[] errors) SetAdmin(string token, string userId)
        {
            return this.changeAdminStatus(token,userId,true);
        }
        /// <summary>
        /// Sets the user as *not* admin, only admins can do that.
        /// </summary>
        /// <param name="token">The token of the user admin that asks the opration.</param>
        /// <param name="userId">The id of the user to un-adminifiy.</param>
        public (bool succes, string[] errors) RemoveAdmin(string token, string userId)
        {
            return this.changeAdminStatus(token,userId,false);
        }
    }
}
