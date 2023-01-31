using System;
using System.Text.Json;

namespace GTrack.Models
{
    public class User : IdentificableItem
    {
        public string uid { get; set; }

        public string email { get; set; }

        public string name { get; set; }

        public string surname { get; set; }

        public string phoneNumber { get; set; }

        public string? password { get; set; }

        public DateTime? lastLogin { get; set; }

        public DateTime? lastLogout { get; set; }

        public string role { get; set; }


        public override string ToString()
        {
            return JsonSerializer.Serialize<User>(this);
        }
    }
}
