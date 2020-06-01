using System;
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
    public class PriceFinalsController : ApiController
    {
        private IUnitOfWork unitOfWork;

        public PriceFinalsController() { }

        public PriceFinalsController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }


        [HttpGet]
        //[ResponseType(typeof(ICollection<PriceFinal>))]
        //[AllowAnonymous]
        [Route("api/TransportLines/CurrentPriceFinals")]
        public IEnumerable<PriceFinal> GetCurrentPriceHistories()
        {
            return unitOfWork.PriceFinal.GetAll().Where(x=> x.Pricelist.To == null);
        }

        // GET: api/PriceFinals
        [AllowAnonymous]
        public IEnumerable<PriceFinal> GetPriceFinals()
        {
            return unitOfWork.PriceFinal.GetAll();
        }

        // GET: api/PriceFinals/5
        [ResponseType(typeof(PriceFinal))]
        [AllowAnonymous]
        public IHttpActionResult GetPriceFinal(int id)
        {
            PriceFinal priceFinal = unitOfWork.PriceFinal.Get(id);
            if (priceFinal == null)
            {
                return NotFound();
            }

            return Ok(priceFinal);
        }

        // PUT: api/PriceFinals/5
        [ResponseType(typeof(void))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PutPriceFinal(int id, PriceFinal priceFinal)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != priceFinal.ID)
            {
                return BadRequest($"PriceFinal with id: {id} doesnt exist");
            }

            

            try
            {
                unitOfWork.PriceFinal.Update(priceFinal);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException e)
            {
                if (!PriceFinalExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return BadRequest(e.Message);
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/PriceFinals
        [ResponseType(typeof(PriceFinal))]
        [HttpPost]
        [Route("api/PriceFinals/{pricelistId}")]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PostPriceFinal(int pricelistId,IList<PriceFinal> priceFinal)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var pricelist = unitOfWork.Pricelist.Get(pricelistId);
                var ticketList = new List<Ticket>()
                {
                    new Ticket() { TicketType = "regularna", UserID = "anonymus" },
                    new Ticket() { TicketType = "dnevna", UserID = "anonymus" },
                    new Ticket() { TicketType = "mesecna", UserID = "anonymus" },
                    new Ticket() { TicketType = "godisnja", UserID = "anonymus" }
                };
            

                for(int i = 0; i < priceFinal.Count; i++)
                {
                    priceFinal[i].Pricelist = pricelist;
                    priceFinal[i].PricelistID = pricelistId;
                    priceFinal[i].Ticket = ticketList[i];
                    unitOfWork.PriceFinal.Add(priceFinal[i]);
                    unitOfWork.Complete();
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

            return Ok(priceFinal);
        }

        // DELETE: api/PriceFinals/5
        [ResponseType(typeof(PriceFinal))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult DeletePriceFinal(int id)
        {
            PriceFinal priceFinal = unitOfWork.PriceFinal.Get(id);
            if (priceFinal == null)
            {
                return NotFound();
            }

            try
            {
                unitOfWork.PriceFinal.Remove(priceFinal);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return Ok(priceFinal);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PriceFinalExists(int id)
        {
            return unitOfWork.PriceFinal.Find(e => e.ID == id).Count() > 0;
        }
    }
}