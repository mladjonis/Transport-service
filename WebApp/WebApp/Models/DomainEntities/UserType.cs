using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.DomainEntities
{
    public class UserType
    {
        [Key]
        public int UserTypeID { get; set; }

        //0---- regularan
        //1---- student
        //2---- penzioner
        public int TypeOfUser { get; set; }

        public double Coefficient{ get; set; }

        public virtual ICollection<ApplicationUser> ApplicationUsers { get; set; }
    }
}