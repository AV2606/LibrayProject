namespace BooksApi.Models.DBsModels
{
    public class Book
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public int? Pages { get; set; }
        public string? Summary { get; set; }
        public string? ImgSrc { get; set; }
    }
}