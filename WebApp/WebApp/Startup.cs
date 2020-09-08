using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.DataProtection;
using Owin;
using WebApp.App_Start;

[assembly: OwinStartup(typeof(WebApp.Startup))]

namespace WebApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);
            app.UseStaticFiles("/imgs");
            app.UseStaticFiles("/docs");
            ConfigureAuth(app);
            app.MapSignalR();
            //Encr.InitRijn();
        }
    }
}
