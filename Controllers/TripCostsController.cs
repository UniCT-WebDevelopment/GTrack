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
    public class TripCostsController : SqlController<TripCost>
    {
        public TripCostsController(MySqlConnection conn, SqlUtils utils) : base(conn, utils) { }

        public override string getTableName()
        {
            return "tripCosts";
        }
    }
        
}
