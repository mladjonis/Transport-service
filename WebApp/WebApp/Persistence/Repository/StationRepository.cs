using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.DomainEntities;

namespace WebApp.Persistence.Repository
{
    public class StationRepository : Repository<Station,int> , IStationRepository
    {
        public StationRepository(DbContext context) : base(context)
        {

        }

        new public Station Get(int id)
        {
            return context.Set<Station>().Where(a => a.StationID == id).Include("StationsOnLines").FirstOrDefault();
        }

        new public IEnumerable<Station> GetAll()
        {
            return context.Set<Station>().Include("StationsOnLines").ToList();
        }
    }
}