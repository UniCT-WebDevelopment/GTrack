using System;
using System.Text.Json;

namespace GTrack.Models
{
    public class Trip : IdentificableItem
    {
        public string uid { get; set; }

        public string code { get; set; }

        public string startDate { get; set; }

        public string endDate { get; set; }

        public int km { get; set; }

        public int durationHours { get; set; }

        public string driver { get; set; }

        public string track { get; set; }

        public string? trailer { get; set; }

        public int activeHoursPerDay { get; set; }

        public string category { get; set; }

        public override string ToString()
        {
            return JsonSerializer.Serialize<Trip>(this);
        }
    }

}
