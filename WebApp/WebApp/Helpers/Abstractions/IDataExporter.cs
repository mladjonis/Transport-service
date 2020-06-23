using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Models;

namespace WebApp.Helpers.Abstractions
{
    public interface IDataExporter
    {
        void Export(string userPath, ApplicationUser user);
    }
}
