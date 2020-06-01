using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.DomainEntities;

namespace WebApp.Persistence.Repository
{
    public class VehicleRepository : Repository<Vehicle, string>, IVehicleRepository
    {
        public VehicleRepository(DbContext context) : base(context)
        {
        }
        new public Vehicle Get(string id)
        {
            return context.Set<Vehicle>().Where(a => a.VehicleID == id).Include("TransportLine").FirstOrDefault();
        }

        new public IEnumerable<Vehicle> GetAll()
        {
            return context.Set<Vehicle>().Include("TransportLine").ToList();
        }
    }
}