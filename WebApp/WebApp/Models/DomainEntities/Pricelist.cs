using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.DomainEntities
{
    public class Pricelist
    {
        public int ID { get; set; }

        [Required]
        public System.DateTime From { get; set; }

        public System.DateTime? To { get; set; }

        public virtual ICollection<PriceFinal> PriceFinals { get; set; }


    }
}