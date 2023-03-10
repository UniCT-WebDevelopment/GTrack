using System;
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
    [AuthenticadedUser]
    public class DriversController : SqlController<Driver>
    {
        public DriversController(MySqlConnection conn, SqlUtils utils) : base(conn, utils) { }

        [AdminAuthorize]
    
        public override Task<ActionResult<bool>> UpdateItem([FromBody] Driver item)
        {
            return base.UpdateItem(item);
        }

        [AdminAuthorize]
   
        public override Task<ActionResult<bool>> DeleteItem([FromBody] Driver item)
        {
            return base.DeleteItem(item);
        }


        public override string getTableName()
        {
            return "drivers";
        }
    }
        
}
