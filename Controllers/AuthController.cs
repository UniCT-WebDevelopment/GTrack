using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using GTrack.Models;
using GTrack.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using Newtonsoft.Json;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using gtrack.Models.config;

namespace GTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AuthController
    {

        private SqlController<User> usersController;
        private JwtConfig _config;
        public AuthController(UsersController usersController, IOptions<JwtConfig> config) {
            this.usersController = usersController;
            _config = config.Value;
        }

       
        [HttpPost("Login")]
        public async Task<ActionResult<User>> Login([FromBody] Credentials item)
        {
            if(string.IsNullOrEmpty(item.email) || string.IsNullOrEmpty(item.password))
            {
                return new BadRequestResult();
            }
            //check credentials
            CompositeFilter f = new CompositeFilter()
            {
                filter = new PropertyFilter()
                {
                    key = "email",
                    value = item.email,
                    matchCriteria = "="
                },
                op = null
            };

            User user = (await usersController.GetFilteredItemsAsync(new CompositeFilter[] { f })).FirstOrDefault();
            if(user == null)
            {
                return new NotFoundResult();
            }

            if(user.password != item.password)
            {
                return new BadRequestResult();
            }

            var token = generateJwtToken(user);
            user.lastLogin = DateTime.Now;
            await usersController.UpdateItemAsync(user);

            return new LoginResult()
            {
                jwtToken = token,
                lastLogin = user.lastLogin,
                lastLogout = user.lastLogout,
                uid = user.uid,
                email = user.email,
                name = user.name,
                surname = user.surname,
                phoneNumber = user.phoneNumber,
                password = user.password,
                role = user.role
            };
        }

        [HttpPost("Logout")]
        public async Task<ActionResult<bool>> Logout([FromBody] User item)
        {
            item.lastLogout = DateTime.Now;
            return await usersController.UpdateItem(item);
        }

        private string generateJwtToken(User user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config.Secret);
            Console.WriteLine("Secret: " + _config.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.uid) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
