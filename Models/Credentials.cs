using System;
using System.Text.Json;

namespace GTrack.Models
{
    public class Credentials
    {
     
        public string email { get; set; }

        public string password { get; set; }

        public override string ToString()
        {
            return JsonSerializer.Serialize<Credentials>(this);
        }
    }
}
