using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.DomainEntities
{
    public class Departures
    {
        public Departures() { }

        public int ID { get; set; }

        public string TimeTable { get; set; }

        public DateTime ValidFrom { get; set; }

        public string TransportLineID { get; set; }

        public virtual TransportLine TransportLines { get; set; }
    }
}