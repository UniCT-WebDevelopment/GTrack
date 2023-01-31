using System;
using System.Text.Json;

namespace GTrack.Models
{
    public class TripStage : IdentificableItem
    {
        public string uid { get; set; }

        public string code { get; set; }

        public string type { get; set; }

        public Address address { get; set; }

        public string trip { get; set; }

        public string customer { get; set; }

        public string date { get; set; }

        public TripStageStateLog[] stateLog { get; set; }


        public override string ToString()
        {
            return JsonSerializer.Serialize<TripStage>(this);
        }
    }

    public class TripStageStateLog
    {
        public string date { get; set; }
        public string state { get; set; }

        public override string ToString()
        {
            return JsonSerializer.Serialize<TripStageStateLog>(this);
        }
    }
}
