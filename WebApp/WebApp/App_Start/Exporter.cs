using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using WebApp.Models;
using iText;
using iText.Layout;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Layout.Element;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout.Properties;
using iText.IO.Image;
using iText.Layout.Renderer;
using iText.Kernel.Colors;

namespace WebApp.App_Start
{
    public class Exporter
    {
        //change this if you change output
        private static readonly string[] headerNames = { "Ime", "Prezime", "Email", "Korisnicko ime", "Datum rodjenja", "Tip korisnika" };
        private static readonly string[] payPalHeaderNames = { "Datum kupovine", "Tip karte", "Cena RSD", "Cena EUR", "Adresa grada", "ZIP drzave", "ZIP grada" };
        /// <summary>
        /// vratiti putanju fajlova
        /// </summary>
        /// <param name="userPath"></param>
        /// <param name="user"></param>
        /// <param name="usertype"></param>
        public static void ExportPdf(string userPath, ApplicationUser user, string usertype, string imagePath,out string dataPdfPath)
        {
            //shorthanded
            //var document = new Document(new PdfDocument(new PdfWriter($"{userPath}.pdf")));

            dataPdfPath = $"{userPath}.pdf";
            var pdfWriter = new PdfWriter($"{userPath}.pdf");
            var pdfDocument = new PdfDocument(pdfWriter);
            var document = new Document(pdfDocument);

            var header = new Paragraph($"Podaci za korisnika {user.UserName}")
                .SetTextAlignment(TextAlignment.CENTER)
                .SetBold()
                .SetFontSize(20);

            var hrLine = new LineSeparator(new SolidLine());
            var newline = new Paragraph(new Text("\n"));

            document.Add(header).Add(hrLine);

            if (!string.IsNullOrEmpty(imagePath))
            {
                Image img = new Image(ImageDataFactory
                                .Create($"{imagePath}"))
                                .SetTextAlignment(TextAlignment.CENTER);
                document.Add(img).Add(newline);
            }

            Table table = new Table(6, true);

            for (int i = 0; i < headerNames.Length; i++)
            {
                Cell cell = new Cell(1, 1)
                    .SetBackgroundColor(ColorConstants.GRAY)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .Add(new Paragraph(headerNames[i]));

                table.AddCell(cell);
            }

            Cell cell11 = new Cell(1, 1)
                .SetTextAlignment(TextAlignment.CENTER)
                .Add(new Paragraph(user.Name));

            Cell cell12 = new Cell(1, 1)
                .SetTextAlignment(TextAlignment.CENTER)
                .Add(new Paragraph(user.Surname));


            Cell cell13 = new Cell(1, 1)
                .SetTextAlignment(TextAlignment.CENTER)
                .Add(new Paragraph(user.Email));


            Cell cell14 = new Cell(1, 1)
                .SetTextAlignment(TextAlignment.CENTER)
                .Add(new Paragraph(user.UserName));


            Cell cell15 = new Cell(1, 1)
                .SetTextAlignment(TextAlignment.CENTER)
                .Add(new Paragraph(user.DateOfBirth.ToString()));


            Cell cell16 = new Cell(1, 1)
                .SetTextAlignment(TextAlignment.CENTER)
                .Add(new Paragraph(usertype));

            table.AddCell(cell11).AddCell(cell12).AddCell(cell13).AddCell(cell14).AddCell(cell15).AddCell(cell16);
            document.Add(newline);
            document.Add(table);
            document.Add(hrLine);
            if (user.Tickets.Any(x => x.PayPalPaymentDetails != null))
            {
                document.Add(new Paragraph("Karte korisnika"))
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetBold()
                    .SetFontSize(20);

                //paypal
                Table payPalTable = new Table(7, true);
                for (int i = 0; i < payPalHeaderNames.Length; i++)
                {
                    Cell cell = new Cell(1, 1)
                        .SetBackgroundColor(ColorConstants.GRAY)
                        .SetTextAlignment(TextAlignment.CENTER)
                        .Add(new Paragraph(payPalHeaderNames[i]));

                    payPalTable.AddCell(cell);
                }

                foreach (var ticket in user.Tickets)
                {
                    Cell cell1 = new Cell(1, 1)
                        .SetTextAlignment(TextAlignment.CENTER)
                        .Add(new Paragraph(ticket.PayPalPaymentDetails.CreateTime));

                    Cell cell2 = new Cell(1, 1)
                        .SetTextAlignment(TextAlignment.CENTER)
                        .Add(new Paragraph(ticket.TicketType));


                    Cell cell3 = new Cell(1, 1)
                        .SetTextAlignment(TextAlignment.CENTER)
                        .Add(new Paragraph(ticket.PriceRSD.ToString()));


                    Cell cell4 = new Cell(1, 1)
                        .SetTextAlignment(TextAlignment.CENTER)
                        .Add(new Paragraph(ticket.PayPalPaymentDetails.TransactionsItemListItemsPrice.ToString()));


                    Cell cell5 = new Cell(1, 1)
                        .SetTextAlignment(TextAlignment.CENTER)
                        .Add(new Paragraph(ticket.PayPalPaymentDetails.ShippingAddressCity));


                    Cell cell6 = new Cell(1, 1)
                        .SetTextAlignment(TextAlignment.CENTER)
                        .Add(new Paragraph(ticket.PayPalPaymentDetails.ShippingAddressCountryCode));

                    Cell cell7 = new Cell(1, 1)
                        .SetTextAlignment(TextAlignment.CENTER)
                        .Add(new Paragraph(ticket.PayPalPaymentDetails.ShippingAddressPostalCode.ToString()));

                    payPalTable.AddCell(cell1).AddCell(cell2).AddCell(cell3).AddCell(cell4).AddCell(cell5).AddCell(cell6).AddCell(cell7);
                    document.Add(newline);
                }
                document.Add(payPalTable);
            }
            document.Close();
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