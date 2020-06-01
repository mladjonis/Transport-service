using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models.DomainEntities
{
    public class PriceFinal
    {
        [ForeignKey("Ticket")]
        public int ID { get; set; }

        [Required]
        public double Price { get; set; }

        public int PricelistID { get; set; }

        public virtual Pricelist Pricelist { get; set; }

        public virtual Ticket Ticket { get; set; }
    }
}