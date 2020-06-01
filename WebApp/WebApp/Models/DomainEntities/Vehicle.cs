using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.DomainEntities
{
    public class Vehicle
    {
        [Key]
        public string VehicleID { get; set; }

        public double X { get; set; }

        public double Y { get; set; }

        public string TransportLineID { get; set; }

        public virtual TransportLine TransportLine { get; set; }
    }
}