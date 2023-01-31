using System;
using System.Text.Json;

namespace GTrack.Models
{
    public class Driver : IdentificableItem
    {
        public string uid { get; set; }

        public string email { get; set; }

        public string name { get; set; }

        public string surname { get; set; }

        public string phoneNumber { get; set; }

        public override string ToString()
        {
            return JsonSerializer.Serialize<Driver>(this);
        }
    }
}
