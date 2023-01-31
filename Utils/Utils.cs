using System;
using System.Data;
using System.Linq;
using MySqlConnector;
using Newtonsoft.Json;

namespace GTrack.Utils
{
    public class SqlUtils
    {
        public SqlUtils()
        {
        }

        public String SqlDatoToJson(MySqlDataReader dataReader)
        {
            var dataTable = new DataTable();
            dataTable.Load(dataReader);
            string JSONString = JsonConvert.SerializeObject(dataTable).Replace("\\\"", "\"").Replace("\\\\","\\").Replace("\"{","{").Replace("}\"", "}").Replace("\"[", "[").Replace("]\"", "]"); ;
            return JSONString;
        }


        public object GetValue(Type type, object value)
        {
            string stringValue = null;
            if (type != null && !type.IsPrimitive && !(type == typeof(Decimal)) && !(type == typeof(String)))
            {
                if (type.IsArray)
                {
                    var mappedArray = string.Join(",",((object[])value).Select(v => GetValue(v.GetType(), v)));
                    stringValue = "[" + mappedArray + "]";
                }
                else
                    stringValue = value.ToString(); //save as string the nested object
            }
            if (type != null && type == typeof(DateTime))
            {
                stringValue = ((DateTime)value).ToString("yyyy-MM-dd HH:mm:ss");
            }
            return stringValue != null ? stringValue : value;
        }
    }
}
