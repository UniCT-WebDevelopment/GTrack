using System;
using System.Text.Json;

namespace GTrack.Models
{
    public class TripCost : IdentificableItem
    {
        public string uid { get; set; }

        public string code { get; set; }

        public string? trip { get; set; }

        public string? description { get; set; }

        public double price { get; set; }

        public string paymentDetails { get; set; }

        public string payedBy { get; set; }

        public string? fuelStation { get; set; }

        public double? liters { get; set; }

        public string? startLocation { get; set; }

        public string? destination { get; set; }

        public string type { get; set; }

        public string date { get; set; }

        public override string ToString()
        {
            return JsonSerializer.Serialize<TripCost>(this);
        }
    }
}

