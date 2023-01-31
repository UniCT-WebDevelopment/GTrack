using System;
using System.Text.Json;

namespace GTrack.Models
{
    public class LoginResult : User
    {
  
        public string jwtToken { get; set; }

        public override string ToString()
        {
            return JsonSerializer.Serialize<LoginResult>(this);
        }
    }
}
