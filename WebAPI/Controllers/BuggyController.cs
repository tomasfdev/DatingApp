using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Data;
using WebAPI.Entities;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuggyController(DataContext context) : ControllerBase
    {
        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetAuth()
        {
            return "Auth error test";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var user = context.Users.Find(-1);

            if (user is null) return NotFound();

            return user;
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            var error = context.Users.Find(-1) ?? throw new Exception("A server error occurred");

            return error + " server error test";
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("Bad request");
        }
    }
}