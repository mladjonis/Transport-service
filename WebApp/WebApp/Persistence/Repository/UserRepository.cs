using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository
{
    public class UserRepository : Repository<ApplicationUser, string>, IUserRepository
    {
        public UserRepository(DbContext context) : base(context)
        {
        }
    }
}