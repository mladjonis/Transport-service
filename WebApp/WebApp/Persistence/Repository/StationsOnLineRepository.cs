using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.DomainEntities;

namespace WebApp.Persistence.Repository
{
    public class StationsOnLineRepository : Repository<StationsOnLine,int> , IStationsOnLineRepository
    {
        public StationsOnLineRepository(DbContext context) : base(context)
        {

        }
        new public StationsOnLine Get(int id)
        {
            return context.Set<StationsOnLine>().Where(a => a.StationsOnLineID == id).Include("Station").Include("TransportLine").FirstOrDefault();
        }

        new public IEnumerable<StationsOnLine> GetAll()
        {
            return context.Set<StationsOnLine>().Include("Station").Include("TransportLine").ToList();
        }

        public IEnumerable<StationsOnLine> GetStationsOnLine(string transportLineId)
        {
            return context.Set<StationsOnLine>().Where(a => a.TransportLineID == transportLineId).Include("Station").Include("TransportLine").ToList();
        }
    }
}