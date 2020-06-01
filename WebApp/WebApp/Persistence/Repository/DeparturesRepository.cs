using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.DomainEntities;

namespace WebApp.Persistence.Repository
{
    public class DeparturesRepository : Repository<Departures,int> , IDeparturesRepository
    {
        public DeparturesRepository(DbContext context) : base(context)
        {
        }

        new public IEnumerable<Departures> GetAll()
        {
            return context.Set<Departures>().Include("TransportLines").ToList();
        }

        new public Departures Get(int id)
        {
            return context.Set<Departures>().Include("TransportLines").FirstOrDefault(x => x.ID == id);
        }
        //dodati kasnije metode sa include-om i ostalo sto treba samo za ovaj tip a nema nasledjeno
    }
}