using gtrack.Models.config;
using GTrack.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gtrack.Utils
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtConfig settings;

        public JwtMiddleware(RequestDelegate next, IOptions<JwtConfig> jwtSettings)
        {
            _next = next;
            settings = jwtSettings.Value;
        }

        public async Task Invoke(HttpContext context, UsersController userService)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
                await attachUserToContextAsync(context, userService, token);

            await _next(context);
        }

        private async Task attachUserToContextAsync(HttpContext context, UsersController userService, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(settings.Secret);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.First(x => x.Type == "id").Value.ToString();

                // attach user to context on successful jwt validation
                var user = await userService.GetItemAsync(userId);
                context.Items["IsAdmin"] = user.role == "admin";
                context.Items["IsOperator"] = user.role != "admin";
            }
            catch
            {
                throw;
                // do nothing if jwt validation fails
                // user is not attached to context so request won't have access to secure routes
            }
        }
    }
}