namespace BooksApi.Models.ApiModels
{
    public class BookModel
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public int Pages { get; set; }
        public string Summary { get; set; }
        public string ImgSrc { get; set; } = "https://images.twinkl.co.uk/tr/image/upload/t_illustration/illustation/book.png";
    }
}
