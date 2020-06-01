using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Unity;
using WebApp.Persistence.Repository;

namespace WebApp.Persistence.UnitOfWork
{
    public class DemoUnitOfWork : IUnitOfWork
    {
        private readonly DbContext _context;

        public DemoUnitOfWork(DbContext context)
        {
            _context = context;
        }

        public int Complete()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }


        [Dependency]
        public IDeparturesRepository Departures { get; set; }

        [Dependency]
        public ILinePointRepository LinePoint { get; set; }

        [Dependency]
        public IPriceFinalRepository PriceFinal { get; set; }

        [Dependency]
        public IPricelistRepository Pricelist { get; set; }

        [Dependency]
        public IStationRepository Station { get; set; }

        [Dependency]
        public IStationsOnLineRepository StationsOnLine { get; set; }

        [Dependency]
        public ITicketRepository Ticket { get; set; }

        [Dependency]
        public ITransportLineRepository TransportLine { get; set; }

        [Dependency]
        public IUserRepository User { get; set; }

        [Dependency]
        public IUserTypeRepository UserType { get; set; }

        [Dependency]
        public IVehicleRepository Vehicle { get; set; }

        [Dependency]
        public IBlogPostRepository BlogPost { get; set; }

        [Dependency]
        public IPayPalRepository PayPal { get; set; }
    }
}