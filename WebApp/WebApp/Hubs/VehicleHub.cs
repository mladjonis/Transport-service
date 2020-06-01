using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using WebApp.Models.DomainEntities;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Hubs
{
    [HubName("Vehicle")]
    public class VehicleHub : Hub
    {
        public VehicleHub()
        {
        }
    }
}