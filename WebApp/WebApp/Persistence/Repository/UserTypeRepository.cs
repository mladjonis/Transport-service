using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.DomainEntities;

namespace WebApp.Persistence.Repository
{
    public class UserTypeRepository : Repository<UserType, int>, IUserTypeRepository
    {
        public UserTypeRepository(DbContext context) : base(context)
        {
        }

        new public IEnumerable<UserType> GetAll()
        {
            return context.Set<UserType>().ToList();
        }
    }
}