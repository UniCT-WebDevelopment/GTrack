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
    public class CustomersController : SqlController<Customer>
    {
        public CustomersController(MySqlConnection conn, SqlUtils utils) : base(conn, utils) { }

        [AdminAuthorize]
    
        public override Task<ActionResult<bool>> UpdateItem([FromBody] Customer item)
        {
            return base.UpdateItem(item);
        }

        [AdminAuthorize]
   
        public override Task<ActionResult<bool>> DeleteItem([FromBody] Customer item)
        {
            return base.DeleteItem(item);
        }

        public override string getTableName()
        {
            return "customers";
        }
    }
        
}
