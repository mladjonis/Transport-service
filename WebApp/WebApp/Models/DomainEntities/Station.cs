using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.DomainEntities
{
    public class Station
    {

        public int StationID { get; set; }

        public string Name { get; set; }

        [Required]
        public double X { get; set; }

        [Required]
        public double Y { get; set; }

        public string Address { get; set; }

        public virtual ICollection<StationsOnLine> StationsOnLines { get; set; }
    }
}