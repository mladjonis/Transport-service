using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Models.DomainEntities;

namespace WebApp.Persistence.Repository
{
    public interface ITicketRepository : IRepository<Ticket,int>
    {

    }
}
