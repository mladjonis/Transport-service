using System;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using WebApp.Models;
using WebApp.Models.DomainEntities;

namespace WebApp.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }
        
        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public DbSet<Departures> Departures { get; set; }
        public DbSet<LinePoint> LinePoints { get; set; }
        public DbSet<PriceFinal> PriceFinals { get; set; }
        public DbSet<Pricelist> Pricelists { get; set; }
        public DbSet<Station> Stations { get; set; }
        public DbSet<StationsOnLine> StationsOnLines { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TransportLine> TransportLines { get; set; }
        public DbSet<UserType> UserTypes { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<PayPalPaymentDetails> PayPalPaymentDetails { get; set; }

    }
}