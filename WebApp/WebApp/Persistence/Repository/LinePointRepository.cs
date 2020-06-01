using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.DomainEntities;

namespace WebApp.Persistence.Repository
{
    public class LinePointRepository : Repository<LinePoint,int> , ILinePointRepository
    {
        public LinePointRepository(DbContext context) : base(context)
        {
        }

        new public LinePoint Get(int id)
        {
            return context.Set<LinePoint>().Where(a => a.LinePointID == id).Include("TransportLine").FirstOrDefault();
        }

        new public IEnumerable<LinePoint> GetAll()
        {
            return context.Set<LinePoint>().Include("TransportLine").ToList();
        }
    }
}