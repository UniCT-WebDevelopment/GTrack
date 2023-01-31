using System;
using System.Text.Json;

namespace GTrack.Models
{
    public class Customer : IdentificableItem
    {
        public string uid { get; set; }

        public string email { get; set; }

        public string name { get; set; }

        public string surname { get; set; }

        public string phoneNumber { get; set; }

        public string businessName { get; set; }

        public Address address { get; set; }


        public override string ToString()
        {
            return JsonSerializer.Serialize<Customer>(this);
        }
    }

    public class Address
    {
        public string streetName { get; set; }
        public string streetNumber { get; set; }
        public string city { get; set; }
        public string postalCode { get; set; }
        public string region { get; set; }
        public string state { get; set; }

        public override string ToString()
        {
            return JsonSerializer.Serialize<Address>(this);
        }
    }
}
