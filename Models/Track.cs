using System;
using System.Text.Json;

namespace GTrack.Models
{
    public class Track : IdentificableItem
    {

        public string uid { get; set; }

        public string licensePlate { get; set; }

        public string manufacturer { get; set; }

        public string model { get; set; }

        public string km { get; set; }

        public string type { get; set; }

        public Expiration expiration { get; set; }

        public DateTime vehicleTax { get; set; }

        public DateTime inspection { get; set; }

        public override string ToString()
        {
            return JsonSerializer.Serialize<Track>(this);
        }
    }


    public class Expiration
    {
        public DateTime effectiveDate { get; set; }
        public double cost { get; set; }
        public string paymentMethod { get; set; }

        public override string ToString()
        {
            return JsonSerializer.Serialize<Expiration>(this);
        }
    }
}
