using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.DomainEntities
{
    public class TransportLine
    {
        [Key]
        public string TransportLineID { get; set; }

        public string FromTo { get; set; }

        public virtual ICollection<Vehicle> Vehicles { get; set; }

        public virtual ICollection<Station> Stations { get; set; }

        public virtual ICollection<LinePoint> LinePoints { get; set; }

    }
}