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
    public class TripStagesController : SqlController<TripStage>
    {
        private SqlController<Package> packagesController;
        public TripStagesController(MySqlConnection conn, SqlUtils utils, PackagesController packagesContr) : base(conn, utils)
        {
            this.packagesController = packagesContr;
        }

        public override async Task<ActionResult<bool>> DeleteItem([FromBody] TripStage item)
        {
            try
            {
                await mutex.WaitAsync();
                var query = "UPDATE " + packagesController.getTableName() + " SET inboundTripUid = null,inboundStageUid = null "
                            + "WHERE inboundStageUid = @stageUid; " +
                            "UPDATE " + packagesController.getTableName() + " SET outboundTripUid = null,outboundStageUid = null " +
                            "WHERE outboundStageUid = @stageUid; ";


                using var command = new MySqlCommand(query, connection);
                command.Parameters.Add(new MySqlParameter("@stageUid", item.uid));
                var res = await command.ExecuteNonQueryAsync();
                return await base.DeleteItem(item);
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
            return "tripStages";
        }
    }
        
}
