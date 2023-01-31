using System;
using System.Text.Json;

namespace GTrack.Models
{
    public class Package : IdentificableItem
    {
        public string uid { get; set; }

        public string code { get; set; }

        public Measure measures { get; set; }

        public string description { get; set; }

        public string inboundStageUid { get; set; }

        public string outboundStageUid { get; set; }

        public string inboundTripUid { get; set; }

        public string outboundTripUid { get; set; }

        public DateTime creationDate { get; set; }

        public string type { get; set; }

        public string estimatedDestinationArea { get; set; }

        public Address estimatedDestinationAddress { get; set; }

        public override string ToString()
        {
            return JsonSerializer.Serialize<Package>(this);
        }
    }

    public class Measure
    {
        public double weight { get; set; }
        public double length { get; set; }
        public double height { get; set; }
        public double width { get; set; }
     

        public override string ToString()
        {
            return JsonSerializer.Serialize<Measure>(this);
        }
    }


}
