using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApp.Persistence;
using System.Data.Entity.Infrastructure;
using System.Xml;
using System.Text;

namespace WebApp.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            using (var ctx = new ApplicationDbContext())
            {
                using (var writer = new XmlTextWriter(@"C:\Users\Mladjan\Desktop\Transport-service\WebApp\WebApp\Model.edmx", Encoding.Default))
                {
                    EdmxWriter.WriteEdmx(ctx, writer);
                }
            }

            return View();
        }
    }
}
