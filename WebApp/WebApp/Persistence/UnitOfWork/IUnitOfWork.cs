using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Persistence.Repository;

namespace WebApp.Persistence.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        int Complete();

        IDeparturesRepository Departures { get; set; }

        ILinePointRepository LinePoint { get; set; }

        IPriceFinalRepository PriceFinal { get; set; }

        IPricelistRepository Pricelist { get; set; }

        IStationRepository Station { get; set; }

        IStationsOnLineRepository StationsOnLine { get; set; }

        ITicketRepository Ticket { get; set; }

        ITransportLineRepository TransportLine { get; set; }

        IUserRepository User { get; set; }

        IUserTypeRepository UserType { get; set; }

        IVehicleRepository Vehicle { get; set; }

        IPayPalRepository PayPal { get; set; }

        IBlogPostRepository BlogPost { get; set; }

    }
}
