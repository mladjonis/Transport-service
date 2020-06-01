using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.DomainEntities;

namespace WebApp.Persistence.Repository
{
    public class PricelistRespository : Repository<Pricelist,int> , IPricelistRepository
    {
        public PricelistRespository(DbContext context) : base(context)
        {

        }

        new public IEnumerable<Pricelist> GetAll()
        {
            return context.Set<Pricelist>().Include("PriceFinals").ToList();
        }

        new public Pricelist Get(int id)
        {
            return context.Set<Pricelist>().Include("PriceFinals").FirstOrDefault(x => x.ID == id);
        }
    }
}