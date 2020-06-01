using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.DomainEntities;

namespace WebApp.Persistence.Repository
{
    public class BlogPostRepository : Repository<BlogPost,int>, IBlogPostRepository
    {
        public BlogPostRepository(DbContext context) : base(context)
        {

        }
    }
}