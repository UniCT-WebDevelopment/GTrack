using System;
using System.Text.Json;

namespace GTrack.Models
{
    public class Intervention : IdentificableItem
    {
        public string uid { get; set; }

        public string code { get; set; }

        public string track { get; set; }

        public string? trip { get; set; }

        public string? description { get; set; }

        public string price { get; set; }

        public string paymentDetails { get; set; }

        public string payedBy { get; set; }

        public string type { get; set; }

        public DateTime date { get; set; }

        public override string ToString()
        {
            return JsonSerializer.Serialize<Intervention>(this);
        }
    }
}

