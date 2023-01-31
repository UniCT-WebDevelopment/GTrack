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
    public class TripsController : SqlController<Trip>
    {
        SqlController<TripStage> stagesController;
        SqlController<TripCost> costsController;
        SqlController<Package> packagesController;

        public TripsController(MySqlConnection conn, SqlUtils utils, TripStagesController stagesContr, TripCostsController costsContr, PackagesController packagesContr) : base(conn, utils) {
            this.stagesController = stagesContr;
            this.costsController = costsContr;
            this.packagesController = packagesContr;
        }

        public override async Task<ActionResult<bool>> DeleteItem([FromBody] Trip item)
        {
            try
            {
                await mutex.WaitAsync();
                var query = "DELETE FROM " + stagesController.getTableName() + " WHERE uid = @tripUid; " +
                        "DELETE FROM " + costsController.getTableName() + " WHERE uid = @tripUid; " +
                        "UPDATE " + packagesController.getTableName() + "  SET inboundTripUid = null,inboundStageUid = null " +
                        "WHERE inboundStageUid = @tripUid; " +
                        "UPDATE " + packagesController.getTableName() + " SET outboundTripUid = null,outboundStageUid = null " +
                        "WHERE outboundStageUid = @tripUid; ";

                using var command = new MySqlCommand(query, connection);
                command.Parameters.Add(new MySqlParameter("@tripUid", item.uid));
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
            return "trips";
        }
    }  
}
