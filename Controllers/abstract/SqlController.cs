using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GTrack.Models;
using MySqlConnector;
using GTrack.Utils;
using Newtonsoft.Json;
using System.Reflection;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using System.Threading;

namespace GTrack.Controllers
{
    [ApiController]
    public abstract class SqlController<T> : ControllerBase where T : IdentificableItem
    {
        public MySqlConnection connection;
        public SqlUtils utils;
        public abstract string getTableName();
        public SemaphoreSlim mutex; //enqueue requests. Right now we use a single connection, if they will be more than one we will use a bulkhead policy.

            

        public SqlController(MySqlConnection connection, SqlUtils utils)
        {
            this.connection = connection;
            this.utils = utils;
            mutex = new SemaphoreSlim(1);
            if(connection.State != System.Data.ConnectionState.Open)
                connection.Open();
        }

        [HttpGet("{uid}")]
        public virtual async Task<ActionResult<T>> GetItem( string uid)
        {
            var res = await this.GetItemAsync(uid);
            if (res == null)
                return NotFound();
            else return res;
           
        }

        public async Task<T> GetItemAsync(string uid)
        {
            try
            {
                await mutex.WaitAsync();
                using var command = new MySqlCommand("SELECT * FROM " + this.getTableName() + " Where uid = @uid;", connection);
                command.Parameters.Add(new MySqlParameter("@uid", uid));
                using var reader = await command.ExecuteReaderAsync();
                string jsonString = utils.SqlDatoToJson(reader);
                T[] result = JsonConvert.DeserializeObject<T[]>(jsonString);
                if (result.Length > 0)
                    return result[0];
                else
                    return default(T);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            finally
            {
                mutex.Release();
            }

        }




        [HttpPut("Update")]
        public virtual async Task<ActionResult<bool>> UpdateItem([FromBody] T item)
        {
           
            return await this.UpdateItemAsync(item);
           
        }

        public async Task<bool> UpdateItemAsync(T item)
        {
            try {
                await mutex.WaitAsync();
                var query = "UPDATE " + this.getTableName() + " SET ";
                var i = 0;
                var objProperties = item.GetType().GetProperties();
                List<MySqlParameter> parameters = new List<MySqlParameter>();
                foreach (PropertyInfo prop in objProperties)
                {
                    var name = prop.Name;
                    var value = prop.GetValue(item);
                    var type = value != null ? value.GetType() : null;
                    var resValue = utils.GetValue(type, value);


                    if (name != "uid")
                    {
                        query += prop.Name + " = @" + prop.Name;
                        if (i != objProperties.Length - 1)
                            query += ", ";
                    }
                    parameters.Add(new MySqlParameter("@" + name, resValue));
                    i++;
                }
                query += " Where uid = @uid";
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddRange(parameters.ToArray());
                var res = await command.ExecuteNonQueryAsync();
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            finally
            {
                mutex.Release();
            }
        }

        [HttpPost("Create")]
        public virtual async Task<T> CreateItem([FromBody] T item)
        {

            return await this.CreateItemAsync(item);

        }

        public async Task<T> CreateItemAsync(T item)
        {
            try
            {
                await mutex.WaitAsync();
                var query = "INSERT INTO " + this.getTableName() + " (";
                var i = 0;
                var objProperties = item.GetType().GetProperties();
                foreach (PropertyInfo prop in objProperties)
                {
                    var name = prop.Name;
                    if (name != "uid")
                    {
                        var value = prop.GetValue(item);
                        query += prop.Name;
                        if (i != objProperties.Length - 1)
                            query += ", ";
                        else
                            query += ") ";
                    }

                    i++;
                }
                query += "VALUES (";
                List<MySqlParameter> parameters = new List<MySqlParameter>();
                i = 0;
                foreach (PropertyInfo prop in objProperties)
                {
                    var name = prop.Name;
                    if (name != "uid")
                    {
                        var value = prop.GetValue(item);
                        var type = value != null ? value.GetType() : null;
                        var resValue = utils.GetValue(type, value);

                        parameters.Add(new MySqlParameter("@" + name, resValue));
                        query += "@" + name;
                        if (i != objProperties.Length - 1)
                            query += ", ";
                        else
                            query += ") ";
                    }
                    i++;
                }
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddRange(parameters.ToArray());
                var res = await command.ExecuteScalarAsync();
                item.uid = command.LastInsertedId.ToString();
                return item;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            finally
            {
                mutex.Release();
            }
        }



        [HttpDelete("Delete")]
        public virtual async Task<ActionResult<bool>> DeleteItem([FromBody] T item)
        {
            
                return await this.DeleteItemAsync(item);
            
        }

        public async Task<bool> DeleteItemAsync(T item)
        {
            try {
                await mutex.WaitAsync();
                using var command = new MySqlCommand("DELETE FROM " + this.getTableName() + " Where uid = @uid;", connection);
                command.Parameters.Add(new MySqlParameter("@uid", item.uid));
                int res = await command.ExecuteNonQueryAsync();
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            finally
            {
                mutex.Release();
            }
        }


        [HttpGet("All")]
        public virtual async Task<ActionResult<T[]>> GetItems()
        {
            
           return await this.GetItemsAsync();
           
        }

        public async Task<T[]> GetItemsAsync()
        {
            try {
                await mutex.WaitAsync();
                using var command = new MySqlCommand("SELECT * FROM " + this.getTableName(), connection);
                using var reader = await command.ExecuteReaderAsync();
                string jsonString = utils.SqlDatoToJson(reader);
                T[] result = JsonConvert.DeserializeObject<T[]>(jsonString);
                if (result.Length > 0)
                    return result;
                else
                    return new T[] { };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            finally
            {
                mutex.Release();
            }
        }

        [HttpPost("Filtered")]
        public virtual async Task<ActionResult<T[]>> GetFilteredItems([FromBody] CompositeFilter[] filters)
        {
            
            return await this.GetFilteredItemsAsync(filters);
           
            
        }

        public async Task<T[]> GetFilteredItemsAsync(CompositeFilter[] filters)
        {
            try {
                await mutex.WaitAsync();
                var query = "SELECT * FROM " + this.getTableName() + " ";
                var i = 0;
                List<MySqlParameter> parameters = new List<MySqlParameter>();
                foreach (CompositeFilter cf in filters)
                {
                    var f = cf.filter;
                    if (i == 0)
                        query += "Where ";


                    var type = f.value != null ? f.value.GetType() : null;
                    string stringValue = null;
                    if (type != null && type == typeof(DateTime))
                    {
                        stringValue = ((DateTime)f.value).ToString("yyyy-MM-dd HH:mm:ss");
                    }

                    if (type == null)
                    {
                        var sqlop = f.matchCriteria == "=" ? "is" : "is not";
                        query += f.key + " " + sqlop + " " + "@" + f.key + "_" + i + " ";
                        parameters.Add(new MySqlParameter("@" + f.key + "_" + i, MySqlDbType.Null));
                    }
                    else if (type == typeof(JArray))
                    {
                        var j = 0;
                        foreach (object par in (JArray)f.value)
                        {
                            if (j == 0)
                                query += f.key + " " + f.matchCriteria + " " + "(";

                            query += "@" + f.key + "_" + j;

                            if (j == ((JArray)f.value).Count() - 1)
                            {
                                query += ")";
                            }
                            else
                            {
                                query += ",";
                            }
                            parameters.Add(new MySqlParameter("@" + f.key + "_" + j, par.ToString()));
                            j++;
                        }

                    }
                    else
                    {
                        query += f.key + " " + f.matchCriteria + " " + "@" + f.key + "_" + i + " ";
                        parameters.Add(new MySqlParameter("@" + f.key + "_" + i, stringValue != null ? stringValue : f.value));
                    }



                    var op = cf.op;
                    if (op.HasValue)
                        query += op.ToString() + " "; //add the operator
                    i++;
                }
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddRange(parameters.ToArray());
                using var reader = await command.ExecuteReaderAsync();
                string jsonString = utils.SqlDatoToJson(reader);
                T[] result = JsonConvert.DeserializeObject<T[]>(jsonString);
                if (result.Length > 0)
                    return result;
                else
                    return new T[] { };

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            finally
            {
                mutex.Release();
            }
        }


    }
}
