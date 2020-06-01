using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models.DomainEntities
{
    public class BlogPost
    {
        public int ID { get; set; }

        public string Title { get; set; }

        public DateTime? PublishedAt { get; set; }

        public string BlogText { get; set; }

        public string UserID { get; set; }

        public virtual ApplicationUser User { get; set; }

    }
}