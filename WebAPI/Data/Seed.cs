using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using WebAPI.Entities;

namespace WebAPI.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context)
        {
            if (await context.Users.AnyAsync()) return;

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true }; //case options

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options); //deserialize/convert userData into c# object with casing options

            if (users == null) return;

            foreach (var user in users)
            {
                using var hmac = new HMACSHA512();
                //creates user
                user.UserName = user.UserName.ToLower();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
                user.PasswordSalt = hmac.Key;

                context.Users.Add(user);    //add user to db
            }

            await context.SaveChangesAsync();
        }
    }
}
