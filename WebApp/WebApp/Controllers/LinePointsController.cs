using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models.DomainEntities;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class LinePointsController : ApiController
    {
        private IUnitOfWork unitOfWork;

        public LinePointsController() { }

        public LinePointsController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }


        // GET: api/LinePoints
        public IEnumerable<LinePoint> GetLinePoints()
        {
            return unitOfWork.LinePoint.GetAll();
        }

        // GET: api/LinePoints/5
        [ResponseType(typeof(LinePoint))]
        public IHttpActionResult GetLinePoint(int id)
        {
            LinePoint linePoint = unitOfWork.LinePoint.Get(id);
            if (linePoint == null)
            {
                return NotFound();
            }

            return Ok(linePoint);
        }

        // PUT: api/LinePoints/5
        [ResponseType(typeof(void))]
        [Authorize(Roles="Admin")]
        public IHttpActionResult PutLinePoint(int id, LinePoint linePoint)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != linePoint.LinePointID)
            {
                return BadRequest();
            }


            try
            {
                unitOfWork.LinePoint.Update(linePoint);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LinePointExists(id))
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

        // POST: api/LinePoints
        [ResponseType(typeof(LinePoint))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PostLinePoint(LinePoint linePoint)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                unitOfWork.LinePoint.Add(linePoint);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return CreatedAtRoute("DefaultApi", new { id = linePoint.LinePointID }, linePoint);
        }

        // DELETE: api/LinePoints/5
        [ResponseType(typeof(LinePoint))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult DeleteLinePoint(int id)
        {
            LinePoint linePoint = unitOfWork.LinePoint.Get(id);
            if (linePoint == null)
            {
                return NotFound();
            }

            try
            {
                unitOfWork.LinePoint.Remove(linePoint);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return Ok(linePoint);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool LinePointExists(int id)
        {
            return unitOfWork.LinePoint.Find(e => e.LinePointID == id).Count() > 0;
        }
    }
}