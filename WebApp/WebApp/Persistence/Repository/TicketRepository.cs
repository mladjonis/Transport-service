using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.DomainEntities;

namespace WebApp.Persistence.Repository
{
    public class TicketRepository : Repository<Ticket,int> , ITicketRepository
    {
        public TicketRepository(DbContext context) : base(context)
        {

        }

        new public IEnumerable<Ticket> GetAll()
        {
            return context.Set<Ticket>().Include("PriceFinal").Include("User").Include("PayPalPaymentDetails").ToList();
        }

        new public Ticket Get(int id)
        {
            return context.Set<Ticket>().Include("PriceFinal").Include("User").Include("PayPalPaymentDetails").FirstOrDefault(x => x.TicketID == id);
        }
    }
}