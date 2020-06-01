using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.DomainEntities
{
    public class StationsOnLine
    {
        public int StationsOnLineID { get; set; }

        [Required]
        public int StationID { get; set; }

        public virtual Station Station { get; set; }

        [Required]
        public string TransportLineID { get; set; }

        public virtual TransportLine TransportLine { get; set; }
    }
}