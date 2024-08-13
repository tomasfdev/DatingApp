using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebAPI.Entities;
using WebAPI.Interfaces;

namespace WebAPI.Services
{
    public class TokenService(IConfiguration config) : ITokenService
    {
        public string CreateToken(AppUser user)
        {
            var tokenKey = config["TokenKey"] ?? throw new Exception("Can't access TokenKey from appsettings");
            if (tokenKey.Length < 64) throw new Exception("Your TokenKey needs to be longer");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));   //creates key

            var claims = new List<Claim>    //set Claims token
            {
                new(ClaimTypes.NameIdentifier, user.UserName)   
            };

            var SignCreds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);    //set SigningCredentials

            var tokenDescriptor = new SecurityTokenDescriptor   //set/describe token elements
            {
                Subject = new ClaimsIdentity(claims),   //sets Subject element of token
                Expires = DateTime.UtcNow.AddDays(7),   //token valid for 7days
                SigningCredentials = SignCreds          //set SigningCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);  //create token

            return tokenHandler.WriteToken(token);
        }
    }
}
