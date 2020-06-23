using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using WebApp.Models;

namespace WebApp.App_Start
{
    public class Exporter
    {
        /// <summary>
        /// vratiti putanju fajlova
        /// </summary>
        /// <param name="userPath"></param>
        /// <param name="user"></param>
        /// <param name="usertype"></param>
        public static void ExportPdf(string userPath, ApplicationUser user, string usertype)
        {
            //using(var stream = new StreamWriter(userPath, true, Encoding.UTF8))
            //{
            //}
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="userPath"></param>
        /// <param name="user"></param>
        /// <param name="usertype"></param>
        public static void ExportCsv(string userPath, ApplicationUser user, string usertype, out string data, out string pp)
        {
            using (var stream = new StreamWriter($"{userPath}.csv", true, Encoding.UTF8))
            {
                stream.WriteLine($"Ime,Prezime,Email,Korisnicko ime,Datum rodjenja,Tip korisnika\n{user.Name},{user.Surname},{user.Email},{user.UserName},{user.DateOfBirth},{usertype}\n");
            }
            data = $"{userPath}.csv";

            using (var stream = new StreamWriter($"{userPath}PayPal.csv", true, Encoding.UTF8))
            {
                var ticketString = $"Datum kupovine,Tip karte,Cena RSD,Cena EUR,Adresa grada,ZIP drzave, ZIP grada\n";
                foreach (var ticket in user.Tickets)
                {
                    ticketString += $"{ticket.PayPalPaymentDetails.CreateTime},{ticket.TicketType},{ticket.PriceRSD},{ticket.PayPalPaymentDetails.TransactionsItemListItemsPrice},{ticket.PayPalPaymentDetails.ShippingAddressCity},{ticket.PayPalPaymentDetails.ShippingAddressCountryCode},{ticket.PayPalPaymentDetails.ShippingAddressPostalCode}\n";
                }
                stream.WriteLine(ticketString);
            }
            pp = $"{userPath}PayPal.csv";
        }
    }
}