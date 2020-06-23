using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using WebApp.Helpers.Abstractions;

namespace WebApp.Helpers
{
    public class EmailSender : IEmailSender
    {
        public void Send(string to, string subject, string body)
        {
            string fromEmail = ConfigurationManager.AppSettings["emailProviderEmail"];
            string password = ConfigurationManager.AppSettings["emailProviderPassword"];
            string smtpClientHost = ConfigurationManager.AppSettings["emailProviderHost"];

            bool parseResult = Int32.TryParse(ConfigurationManager.AppSettings["emailProviderPort"], out int smtpClientPort);
            if (!parseResult)
            {
                // simulate log for failure
            }
            MailMessage mailMessage = new MailMessage(fromEmail, to, subject, body)
            {
                IsBodyHtml = true
            };
            using (var smtpClient = new SmtpClient())
            {
                smtpClient.UseDefaultCredentials = true;
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.Host = smtpClientHost;
                smtpClient.Port = smtpClientPort;
                smtpClient.EnableSsl = true;
                smtpClient.Credentials = new NetworkCredential(fromEmail, password);
                try
                {
                    smtpClient.Send(mailMessage);
                }
                catch (Exception ex)
                {
                    // simulate log with exception details
                }
            }
        }
    }
}