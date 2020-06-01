using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models.DomainEntities;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class StationsOnLinesController : ApiController
    {
        private IUnitOfWork unitOfWork;

        public StationsOnLinesController() { }

        public StationsOnLinesController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/StationsOnLines
        public IEnumerable<StationsOnLine> GetStationsOnLines()
        {
            return unitOfWork.StationsOnLine.GetAll();
        }

        [Route("api/StationsOnLines/{transportLineId}")]
        public IEnumerable<StationsOnLine> GetStationsOnLine(string transportLineId)
        {
            return unitOfWork.StationsOnLine.GetStationsOnLine(transportLineId);
        }

        // GET: api/StationsOnLines/5
        [AllowAnonymous]
        [ResponseType(typeof(StationsOnLine))]
        public IHttpActionResult GetStationsOnLine(int id)
        {
            StationsOnLine stationsOnLine = unitOfWork.StationsOnLine.Get(id);
            if (stationsOnLine == null)
            {
                return NotFound();
            }

            return Ok(stationsOnLine);
        }

        // PUT: api/StationsOnLines/5
        [ResponseType(typeof(void))]
        [Authorize(Roles ="Admin")]
        public IHttpActionResult PutStationsOnLine(int id, StationsOnLine stationsOnLine)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != stationsOnLine.StationsOnLineID)
            {
                return BadRequest();
            }

            

            try
            {
                unitOfWork.StationsOnLine.Update(stationsOnLine);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StationsOnLineExists(id))
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

        // POST: api/StationsOnLines
        [ResponseType(typeof(StationsOnLine))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PostStationsOnLine(StationsOnLine stationsOnLine)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                unitOfWork.StationsOnLine.Add(stationsOnLine);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return CreatedAtRoute("DefaultApi", new { id = stationsOnLine.StationsOnLineID }, stationsOnLine);
        }

        // DELETE: api/StationsOnLines/5
        [ResponseType(typeof(StationsOnLine))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult DeleteStationsOnLine(int id)
        {
            StationsOnLine stationsOnLine = unitOfWork.StationsOnLine.Get(id);
            if (stationsOnLine == null)
            {
                return NotFound();
            }

            try
            {
                unitOfWork.StationsOnLine.Remove(stationsOnLine);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return Ok(stationsOnLine);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StationsOnLineExists(int id)
        {
            return unitOfWork.StationsOnLine.Find(e => e.StationID == id).Count() > 0;
        }
    }
}