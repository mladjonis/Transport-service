using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.AspNet.Identity;
using WebApp.App_Start;
using WebApp.Models;
using WebApp.Models.DomainEntities;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    //[Authorize]
    public class TicketsController : ApiController
    {
        private IUnitOfWork unitOfWork { get; set; }

        public TicketsController() { }

        public TicketsController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }


        [Route("api/tickets/UserType")]
        [HttpGet]
        public IHttpActionResult GetUserType()
        {
            var userId = User.Identity.GetUserId();
            if (userId != null)
            {
                var user = this.unitOfWork.User.Get(userId);
                var usertype = user.UserType.TypeOfUser;
                string userstring = string.Empty;
                if(usertype == 0)
                {
                    userstring = "regularan";
                }else if(usertype == 1)
                {
                    userstring = "student";
                }else
                {
                    userstring = "penzioner"; 
                }
                return Ok(userstring);
            } else
            {
                return Ok("regularan");
            }
        }

        //treba
        [NonAction]
        private DateTime ExpiresAt(string tipKarte)
        {
            DateTime dateTime = DateTime.Now;
            switch (tipKarte)
            {
                case "regularna":
                    {
                        dateTime = dateTime.AddHours(1);
                        break;
                    }
                case "dnevna":
                    {
                        dateTime = dateTime.AddHours(23 - dateTime.Hour);
                        dateTime = dateTime.AddMinutes(59 - dateTime.Minute);
                        dateTime = dateTime.AddSeconds(59 - dateTime.Second);
                        break;
                    }
                case "mesecna":
                    {
                        var daysInMonth = DateTime.DaysInMonth(dateTime.Year, dateTime.Month);

                        dateTime = dateTime.AddDays(daysInMonth - dateTime.Day);
                        dateTime = dateTime.AddHours(23 - dateTime.Hour);
                        dateTime = dateTime.AddMinutes(59 - dateTime.Minute);
                        dateTime = dateTime.AddSeconds(59 - dateTime.Second);
                        break;
                    }
                case "godisnja":
                    {
                        dateTime = dateTime.AddMonths(13 - dateTime.Month);
                        dateTime = dateTime.AddDays(-dateTime.Day);
                        dateTime = dateTime.AddHours(23 - dateTime.Hour);
                        dateTime = dateTime.AddMinutes(59 - dateTime.Minute);
                        dateTime = dateTime.AddSeconds(60 - dateTime.Second);
                        break;
                    }
            }
            return dateTime;
        }

        [Route("api/tickets/BuyTicket/{karta}")]
        [HttpPost]
        //[Authorize(Roles = "AppUser")]
        [ResponseType(typeof(Ticket))]
        public IHttpActionResult Buy(string karta,PayPalPaymentDetails paymentDetails)
        {
            var userId = User.Identity.GetUserId();
            ApplicationUser user = new ApplicationUser();
            UserType userType;

            if (userId == null)
            {
                user = this.unitOfWork.User.Get("appu");
                userType = this.unitOfWork.UserType.Get(1);
            }
            else
            {
                user = this.unitOfWork.User.Get(userId);

                userType = this.unitOfWork.UserType.Get((int)user.UserTypeID);
            }

            

            Pricelist pricelist = unitOfWork.Pricelist.Find(x => x.To == null).FirstOrDefault();
            if (pricelist == null)
                return BadRequest("trenutno ne postoji cenovnik");

            PriceFinal priceFinal = unitOfWork.PriceFinal.GetAll().Where(z => z.PricelistID == pricelist.ID).FirstOrDefault();
            if (priceFinal == null)
                return BadRequest("trenutno ne postoji cena trenutni cenovnik");

            DateTime dateTimeNow = DateTime.UtcNow;

            var expires = ExpiresAt(karta);
            Ticket ticket;
            if (userId == null)
            {
                ticket = new Ticket()
                {
                    BoughtAt = dateTimeNow,
                    PayPalPaymentDetails = paymentDetails,
                    TicketType = karta,
                    UserID = "appu",
                    User = user,
                    PriceRSD = priceFinal.Price * 1,
                    Expires = expires,
                    //PriceFinal = priceFinal
                };
            } else
            {
                ticket = new Ticket()
                {
                    BoughtAt = dateTimeNow,
                    PayPalPaymentDetails = paymentDetails,
                    PriceRSD = priceFinal.Price * userType.Coefficient,
                    TicketType = karta,
                    UserID = userId,
                    User = user,
                    Expires = expires,
                    //PriceFinal = priceFinal
                };

                if (user.Status == null)
                {
                    ticket.PriceRSD = priceFinal.Price * 1;
                }
                var str = $"Bought at:{ticket.BoughtAt}\t Price in RSD:{ticket.PriceRSD}\t Ticket type:{ticket.TicketType}\t UserID:{ticket.UserID}\n\n Thank You for using our service.";
                SendEMailHelper.Send(user.Email, "Ticket details from transport service",
                    str);
            }

            unitOfWork.Ticket.Add(ticket);
            //unitOfWork.Ticket.att
            unitOfWork.Complete();

            PriceFinal p = new PriceFinal()
            {
                Price = userType.Coefficient * priceFinal.Price,
                PricelistID = pricelist.ID,
                Pricelist = pricelist,
                Ticket = ticket
            };


            unitOfWork.PriceFinal.Add(p);
            unitOfWork.Complete();

            ticket.PriceFinal = p;

            unitOfWork.Ticket.Update(ticket);
            unitOfWork.Complete();

            return Ok(ticket);   
        }


        // GET: api/Tickets
        public IEnumerable<Ticket> GetTickets()
        {
            return unitOfWork.Ticket.GetAll();
        }

        [Route("api/Tickets/Current")]
        [HttpGet]
        public IEnumerable<Ticket> GetCurrentTickets()
        {
            var returnValue = new List<Ticket>();
            foreach(var ticket in unitOfWork.Ticket.GetAll())
            {
                if(ticket.PriceFinal != null)
                {
                    if(ticket.PriceFinal.Pricelist.To == null)
                    {
                        returnValue.Add(ticket);
                    }
                }
            }
            return returnValue;
        }

        // GET: api/Tickets/5
        [ResponseType(typeof(Ticket))]
        public IHttpActionResult GetTicket(int id)
        {
            Ticket ticket = unitOfWork.Ticket.Get(id);
            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }

        // PUT: api/Tickets/5
        [ResponseType(typeof(void))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PutTicket(int id, Ticket ticket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != ticket.TicketID)
            {
                return BadRequest();
            }

           
            try
            {
                unitOfWork.Ticket.Update(ticket);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id))
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

        // POST: api/Tickets
        [ResponseType(typeof(Ticket))]
        [Authorize(Roles = "Admin,AppUser")]
        public IHttpActionResult PostTicket(Ticket ticket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                unitOfWork.Ticket.Add(ticket);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return CreatedAtRoute("DefaultApi", new { id = ticket.TicketID }, ticket);
        }

        // DELETE: api/Tickets/5
        [ResponseType(typeof(Ticket))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult DeleteTicket(int id)
        {
            Ticket ticket = unitOfWork.Ticket.Get(id);
            if (ticket == null)
            {
                return NotFound();
            }

            try
            {
                unitOfWork.Ticket.Remove(ticket);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return Ok(ticket);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TicketExists(int id)
        {
            return unitOfWork.Ticket.Find(e => e.TicketID == id).Count() > 0;
        }
    }
}