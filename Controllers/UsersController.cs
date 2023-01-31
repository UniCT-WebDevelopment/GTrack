using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;
using GTrack.Models;
using GTrack.Utils;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Newtonsoft.Json;

namespace GTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : SqlController<User>
    {
        public UsersController(MySqlConnection conn, SqlUtils utils) : base(conn, utils) { }

        [AdminAuthorize]
        public override async Task<ActionResult<bool>> UpdateItem([FromBody] User item)
        {
            await mutex.WaitAsync();
            try
            {
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


                    if (name != "uid" && name != "password")
                    {
                        query += prop.Name + " = @" + prop.Name;
                        if (i != objProperties.Length - 1)
                            query += ", ";
                    }
                    if (name != "password")
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

        [AdminAuthorize]
        [HttpPut("password")]
        public async Task<ActionResult<bool>> UpdatePassword([FromBody] User item)
        {
            await mutex.WaitAsync();
            try
            {
                if (item.password == null)
                {
                    return false;
                }
                await connection.OpenAsync();
                var query = "UPDATE " + this.getTableName() + " SET password = @password Where uid = @uid";
                using var command = new MySqlCommand(query, connection);
                command.Parameters.Add(new MySqlParameter("@password", item.password));
                command.Parameters.Add(new MySqlParameter("@uid", item.uid));
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

        public override string getTableName()
        {
            return "users";
        }


    }
        
}
