using Microsoft.AspNetCore.Mvc;

namespace BooksApi.Controllers
{
    [ApiController]
    [Route("")]
    public class CorsController:Controller
    {
        [HttpGet("*")]
        public async Task<IActionResult> Get()
        {
            return Ok();
        }
        [HttpGet("api/*")]
        public async Task<IActionResult> GetApi()
        {
            return Ok();
        }
        [HttpOptions("")]
        public async Task<IActionResult> GetOptions()
        {
            return base.NoContent();
        }

    }
}
