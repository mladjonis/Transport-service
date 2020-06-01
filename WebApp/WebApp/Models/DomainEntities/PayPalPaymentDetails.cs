using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.DomainEntities
{
    public class PayPalPaymentDetails
    {
        [Key]
        public string Id { get; set; }

        public string Intent { get; set; }

        public string State { get; set; }

        public string Cart { get; set; }

        public string CreateTime { get; set; }

        public string PayerPaymentMethod { get; set; }

        public string PayerStatus { get; set; }

        public string PayerEmail { get; set; }

        public string PayerFirstName { get; set; }

        public string PayerMiddleName { get; set; }

        public string PayerLastName { get; set; }

        public string PayerId { get; set; }

        public string PayerCountryCode { get; set; }

        public string ShippingAddressRecipientName { get; set; }

        public string ShippingAddressStreet { get; set; }

        public string ShippingAddressCity { get; set; }

        public string ShippingAddressState { get; set; }

        public int ShippingAddressPostalCode { get; set; }

        public string ShippingAddressCountryCode { get; set; }

        public double TransactionsAmountTotal { get; set; }

        public string TransactionsAmountCurrency { get; set; }

        public double TransactionsDetailsSubtotal { get; set; }

        public double TransactionsDetailsShipping { get; set; }

        public double TransactionsDetailsHandlingFee { get; set; }

        public double TransactionsDetailsInsurance { get; set; }

        public double TransactionsShippingDiscount { get; set; }

        public string TransactionsItemListItemsName { get; set; }

        public double TransactionsItemListItemsPrice { get; set; }

        public string TransactionsItemListItemsCurrencty { get; set; }

        public int TransactionsItemListItemsQuantity { get; set; }

        public double TransactionsItemListItemsTax { get; set; }

    }
}