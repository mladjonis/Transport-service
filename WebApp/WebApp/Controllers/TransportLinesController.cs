using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models.DomainEntities;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class TransportLinesController : ApiController
    {
        private IUnitOfWork unitOfWork;

        public TransportLinesController() { }

        public TransportLinesController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }


        // GET: api/TransportLines
        [AllowAnonymous]
        public IEnumerable<TransportLine> GetTransportLines()
        {
            return unitOfWork.TransportLine.GetAll();
        }

        [Route("api/TransportLines/WithBuses")]
        [HttpGet]
        [AllowAnonymous]
        public IEnumerable<TransportLine> GetLinesWithBuses()
        {
            return unitOfWork.TransportLine.GetAll().Where(x => x.Vehicles.Count > 0);
        }

        // GET: api/TransportLines/5
        [ResponseType(typeof(TransportLine))]
        [AllowAnonymous]
        public IHttpActionResult GetTransportLine(string id)
        {
            TransportLine transportLine = unitOfWork.TransportLine.Get(id);
            if (transportLine == null)
            {
                return NotFound();
            }

            return Ok(transportLine);
        }

        // PUT: api/TransportLines/5
        [ResponseType(typeof(void))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PutTransportLine(string id, TransportLine transportLine)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != transportLine.TransportLineID)
            {
                return BadRequest();
            }

            TransportLine transportLineInDb = unitOfWork.TransportLine.Get(id);
            if (transportLineInDb == null)
            {
                //return NotFound();
                unitOfWork.TransportLine.Add(new TransportLine()
                { 
                    TransportLineID = id,
                    FromTo = transportLine.FromTo
                });
                unitOfWork.Complete();
                transportLineInDb = unitOfWork.TransportLine.Get(id);
            }


            try
            {
                var linePointsForLine = unitOfWork.LinePoint.Find(z => z.TransportLineID == transportLineInDb.TransportLineID).ToList();
                //unitOfWork.LinePoint.GetAll().Where(lp=>lp.TransportLineID==transportLineInDb.TransportLineID).ToList().ForEach(lp.delete);
                unitOfWork.LinePoint.RemoveRange(linePointsForLine);
                unitOfWork.Complete();
                //unitOfWork.LinePoint.AddRange(transportLine.LinePoints);
                foreach (var newLine in transportLine.LinePoints)
                {
                    unitOfWork.LinePoint.Add(new LinePoint()
                    {
                        TransportLineID = newLine.TransportLineID,
                        X = newLine.X,
                        Y = newLine.Y
                    });
                    unitOfWork.Complete();
                }

                var stationsOnLine = unitOfWork.StationsOnLine.Find(z => z.TransportLineID == transportLineInDb.TransportLineID).ToList();
                unitOfWork.StationsOnLine.RemoveRange(stationsOnLine);
                unitOfWork.Complete();
                foreach (var newStation in transportLine.Stations)
                {
                    var station = new Station()
                    {
                        X = newStation.X,
                        Y = newStation.Y,
                        Address = newStation.Address,
                        Name = newStation.Name
                    };
                    unitOfWork.Station.Add(station);
                    unitOfWork.StationsOnLine.Add(new StationsOnLine()
                    {
                        StationID = station.StationID,
                        TransportLineID = transportLineInDb.TransportLineID
                    });
                    unitOfWork.Complete();
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransportLineExists(id))
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

        // POST: api/TransportLines
        [ResponseType(typeof(TransportLine))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PostTransportLine(TransportLine transportLine)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                unitOfWork.TransportLine.Add(transportLine);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return CreatedAtRoute("DefaultApi", new { id = transportLine.TransportLineID }, transportLine);
        }

        // DELETE: api/TransportLines/5
        [ResponseType(typeof(TransportLine))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult DeleteTransportLine(string id)
        {
            TransportLine transportLine = unitOfWork.TransportLine.Get(id);
            if (transportLine == null)
            {
                return NotFound();
            }

            try
            {
                unitOfWork.Departures.Remove(unitOfWork.Departures.Find(dep => dep.TransportLineID == id).FirstOrDefault());
                unitOfWork.Complete();
                unitOfWork.TransportLine.Remove(transportLine);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return Ok(transportLine);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TransportLineExists(string id)
        {
            return unitOfWork.TransportLine.Find(e => e.TransportLineID == id).Count() > 0;
        }
    }
}