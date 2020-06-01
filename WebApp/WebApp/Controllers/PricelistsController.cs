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
    [Authorize]
    public class PricelistsController : ApiController
    {
        private IUnitOfWork unitOfWork;


        public PricelistsController() { }

        public PricelistsController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }


        [Route("api/Pricelists/Current")]
        [HttpGet]
        //[ResponseType(typeof(Pricelist))]
        [Authorize(Roles="Admin")]
        public IHttpActionResult GetCurrentPricelist()
        {
            var pricelist = unitOfWork.Pricelist.Find(x => x.To == null).FirstOrDefault();
            return Ok(pricelist);
        }

        [Route("api/Pricelists/Past")]
        [HttpGet]
        public IHttpActionResult GetPastPricelists()
        {
            var pricelists = unitOfWork.Pricelist.Find(x => x.To != null).AsEnumerable();
            var pr = unitOfWork.Pricelist.GetAll().Where(x => x.To != null).ToList();
            return Ok(pr);
        }


        // GET: api/Pricelists
        [Authorize(Roles ="Admin")]
        public IEnumerable<Pricelist> GetPricelists()
        {
            return unitOfWork.Pricelist.GetAll();
        }


        // GET: api/Pricelists/5
        //[ResponseType(typeof(Pricelist))]
        //[Route("api/Pricelists/GetPricelist/{id}")]
        //vratiti authorize
        [Authorize(Roles ="Admin")]
        public IHttpActionResult GetPricelist(int id)
        {
            Pricelist pricelist = unitOfWork.Pricelist.Get(id);
            if (pricelist == null)
            {
                return NotFound();
            }

            return Ok(pricelist);
        }

        // PUT: api/Pricelists/5
        //[ResponseType(typeof(void))]
        ///[Route("api/pricelists/editPricelist/{id}")]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PutPricelist(int id, Pricelist pricelist)
        {


            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pricelist.ID)
            {
                return BadRequest();
            }



            try
            {

                var pricelistPriceFinalsParameter = pricelist.PriceFinals.ToList();
                var priceListDb = unitOfWork.Pricelist.Find(x => x.ID == pricelist.ID).FirstOrDefault();
                var priceFinalsDb = priceListDb.PriceFinals.ToList();
                priceFinalsDb[0].Price = pricelistPriceFinalsParameter[0].Price;
                priceFinalsDb[1].Price = pricelistPriceFinalsParameter[1].Price;
                priceFinalsDb[2].Price = pricelistPriceFinalsParameter[2].Price;
                priceFinalsDb[3].Price = pricelistPriceFinalsParameter[3].Price;
                unitOfWork.Pricelist.Update(priceListDb);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PricelistExists(id))
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

        // POST: api/Pricelists
        //[ResponseType(typeof(Pricelist))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PostPricelist(Pricelist pricelist)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                DateTime dateTimeNow = DateTime.Now;
                Pricelist lastPricelist = unitOfWork.Pricelist.Find(x => x.To == null).FirstOrDefault();
                lastPricelist.To = dateTimeNow;

                pricelist.From = dateTimeNow;
                pricelist.To = null;

                unitOfWork.Pricelist.Update(lastPricelist);
                unitOfWork.Pricelist.Add(pricelist);
                unitOfWork.Complete();
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

            return Ok(pricelist.ID);
            ///return CreatedAtRoute("DefaultApi", new { id = pricelist.ID }, pricelist);
        }

        // DELETE: api/Pricelists/5
        [ResponseType(typeof(Pricelist))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult DeletePricelist(int id)
        {
            Pricelist pricelist = unitOfWork.Pricelist.Get(id);
            if (pricelist == null)
            {
                return NotFound();
            }

            try
            {
                unitOfWork.Pricelist.Remove(pricelist);
                unitOfWork.Complete();
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

            return Ok(pricelist);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PricelistExists(int id)
        {
            return unitOfWork.Pricelist.Find(e => e.ID == id).Count() > 0;
        }
    }
}