using System;
using System.Text.Json;

namespace GTrack.Models
{

    public class CompositeFilter
    {
        public PropertyFilter filter { get; set; }
        public Operator? op {get; set;}
        public override string ToString()
        {
            return JsonSerializer.Serialize<CompositeFilter>(this);
        }
    }

   
    public class PropertyFilter
    {
        public string key { get; set; }
        public object value { get; set; }
        private string _matchCriteria { get; set; }
        public string matchCriteria
        {
            get => _matchCriteria;
            set
            {
                if(value == "==")
                    this._matchCriteria = "="; //sql mapping

                else if (value == "!=")
                    this._matchCriteria = "<>"; //sql mapping
                else this._matchCriteria = value;
            }
        }
        public string subContext { get; set; } //for queries with a join on a fixed "parent".
        public override string ToString()
        {
            return JsonSerializer.Serialize<PropertyFilter>(this);
        }

    }

    public enum Operator
    {
       AND,
       OR
    }
}
