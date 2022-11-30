using BooksApi.Models.DBsModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BooksApi.Models
{
    public class BooksDbContext: IdentityDbContext<ApplicationUser>
    {

        public BooksDbContext(DbContextOptions<BooksDbContext> options):base(options)
        {  
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Book>().HasData(
                new Book()
                {
                    Author = "local",
                    ImgSrc = "https://images.twinkl.co.uk/tr/image/upload/t_illustration/illustation/book.png",
                    Summary = "no summary just peter pen",
                    Pages = 233,
                    Title = "Peter Pen",
                    Id = -1
                },
                new Book()
                {
                    Author = "local",
                    ImgSrc = "https://images.twinkl.co.uk/tr/image/upload/t_illustration/illustation/book.png",
                    Summary = "How easy it to duplicate Nazi Germany?",
                    Pages = 248,
                    Title = "The Wave",
                    Id = -2
                }
                );

            builder.Entity<ApplicationUser>().HasData(
                new ApplicationUser()
                {
                    UserName = "Admin",
                    NormalizedUserName = "ADMIN",
                    Email = "AdminsMail@gmail.com",
                    NormalizedEmail = "ADMINSMAIL@GMAIL.COM",
                    PasswordHash = "AQAAAAEAACcQAAAAEPqLMK5nmU+617cOResj//gUbxpBQ+elgbpY1mHVkGtUGIv6HF3IGLCzxwqEGWb5JA==",
                    Id = "7c297351-c660-4803-b1b7-0ea2981e59cb",
                    IsAdmin = true,
                    SecurityStamp= "5Z4ZJTHUV33KCTJRTNEITOIUH3GNPMBN",
                    ConcurrencyStamp= "e831fe28-3f29-4324-8bb9-284b866edc4c"
                },
                new ApplicationUser()
                {
                    UserName = "NotAdmin",
                    NormalizedUserName = "NOTADMIN",
                    Email = "user2@example.com",
                    NormalizedEmail = "USER2@EXAMPLE.COM",
                    PasswordHash = "AQAAAAEAACcQAAAAEFH5fFWKC/lgpp5ncb1hxGEvUi6Lj/bjvokIfrLERAeWwKt3uONoonLPwMXomUgpnw==",
                    Id = "43e04b8a-7e8c-46f0-a66b-776550389805",
                    IsAdmin = false,
                    SecurityStamp = "DZKZOOCQ5RDTZ4YCRBHJFLDAQWGB563N",
                    ConcurrencyStamp = "1b724a1b-d3e9-48d7-a9f1-a828c88bcdf9"
                }
                ); 
            builder.Entity<Book>().HasKey(x => x.Id);
            builder.Entity<Book>().Property(x => x.Id).UseIdentityColumn();

            builder.Entity<Borrow>().HasKey(x => x.Id);
            builder.Entity<Borrow>().Property(x => x.Id).UseIdentityColumn();
        }

        public DbSet<Book> Books { get; set; }
        public DbSet<Borrow> Borrows { get; set; }

    }
}
