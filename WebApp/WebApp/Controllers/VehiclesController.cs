using Microsoft.AspNet.SignalR;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.App_Start;
using WebApp.Hubs;
using WebApp.Models.DomainEntities;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class VehiclesController : ApiController
    {
        private IUnitOfWork unitOfWork;
        private VehicleHub vehicleHub;

        public VehiclesController() { }

        public VehiclesController(IUnitOfWork unitOfWork,VehicleHub vehicleHub)
        {
            this.unitOfWork = unitOfWork;
            this.vehicleHub = vehicleHub;
        }

        [Route("api/vehicles/updateVehiclePosition")]
        [HttpPost]
        [AllowAnonymous]
        [ResponseType(typeof(void))]
        public IHttpActionResult UpdateVehiclePosition()
        {
            string data = string.Empty;
            var linesWithBuses = unitOfWork.TransportLine.GetAll().Where(x => x.Vehicles.Count > 0 && x.TransportLineID=="64A");
            foreach (var lwb in linesWithBuses)
            {
                var vehiclesOnLine = lwb.Vehicles.ToList();
                var path = lwb.LinePoints.ToList();
                var pathCountEnd = path.Count - 1;
                double distanceTraveled = 10.0; //m
                for (int i = 0; i < vehiclesOnLine.Count; i++)
                {
                    double bearing = 0.0;
                    if (vehiclesOnLine[i].X == path[path.Count - 1].X && vehiclesOnLine[i].Y == path[path.Count - 1].Y)
                    {
                        vehiclesOnLine[i].X = path[0].X;
                        vehiclesOnLine[i].Y = path[0].Y;
                    }

                    (double, double) move = (path[0].X, path[0].Y);

                    for (int j = 0; j < path.Count - 1; j++)
                    {
                        var initVehLatitude = path[j].X;
                        var initVehLongitude = path[j].Y;
                        distanceTraveled += 0.05;
                        //bearing = HaversineFormula.Bearing(move.Item1, move.Item2, path[j + 1].X, path[j + 1].Y);
                        bearing = HaversineFormula.Bearing(initVehLatitude, initVehLongitude, path[j + 1].X, path[j + 1].Y);

                        //move = HaversineFormula.CalculateNewSetOfPoints(initVehLatitude, initVehLongitude, bearing, distanceTraveled);
                        move = HaversineFormula.CalculateNewSetOfPoints(move.Item1, move.Item2, bearing, distanceTraveled);
                        data = $"{vehiclesOnLine[i].VehicleID},{move.Item1},{move.Item2},{vehiclesOnLine[i].TransportLineID}|";

                        if (data.EndsWith("|"))
                        {
                            data = data.Substring(0, data.Length - 1);
                        }

                        var hubContext = GlobalHost.ConnectionManager.GetHubContext<VehicleHub>();
                        hubContext.Clients.All.newPositions(data);
                        Thread.Sleep(2000);
                    }
                }
            }
            return Ok();
        }


        // GET: api/Vehicles
        public IEnumerable<Vehicle> GetVehicles()
        {
            return unitOfWork.Vehicle.GetAll();
        }

        // GET: api/Vehicles/5
        [ResponseType(typeof(Vehicle))]
        public IHttpActionResult GetVehicle(string id)
        {
            Vehicle vehicle = unitOfWork.Vehicle.Get(id);
            if (vehicle == null)
            {
                return NotFound();
            }

            return Ok(vehicle);
        }

        // PUT: api/Vehicles/5
        [ResponseType(typeof(void))]
        [System.Web.Http.Authorize(Roles="Admin")]
        public IHttpActionResult PutVehicle(string id, Vehicle vehicle)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vehicle.VehicleID)
            {
                return BadRequest();
            }

            

            try
            {
                unitOfWork.Vehicle.Update(vehicle);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Vehicles
        [ResponseType(typeof(Vehicle))]
        [System.Web.Http.Authorize(Roles = "Admin")]
        public IHttpActionResult PostVehicle(Vehicle vehicle)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                unitOfWork.Vehicle.Add(vehicle);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return CreatedAtRoute("DefaultApi", new { id = vehicle.VehicleID }, vehicle);
        }

        // DELETE: api/Vehicles/5
        [ResponseType(typeof(Vehicle))]
        [System.Web.Http.Authorize(Roles = "Admin")]
        public IHttpActionResult DeleteVehicle(string id)
        {
            Vehicle vehicle = unitOfWork.Vehicle.Get(id);
            if (vehicle == null)
            {
                return NotFound();
            }

            try
            {
                unitOfWork.Vehicle.Remove(vehicle);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return Ok(vehicle);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool VehicleExists(string id)
        {
            return unitOfWork.Vehicle.Find(e => e.VehicleID == id).Count() > 0;
        }
    }
}