using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Models.DomainEntities;

namespace WebApp.Persistence.Repository
{
    public interface IStationsOnLineRepository : IRepository<StationsOnLine,int>
    {
        IEnumerable<StationsOnLine> GetStationsOnLine(string transportLineId);
    }
}
