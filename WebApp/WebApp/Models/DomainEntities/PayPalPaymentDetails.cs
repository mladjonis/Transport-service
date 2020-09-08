﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using WebApp.App_Start;

namespace WebApp.Models.DomainEntities
{
    public class PayPalPaymentDetails
    {
        [Key]
        public string Id { get; set; }

        public string Intent { get; private set; }

        public string State { get; private set; }

        public string Cart { get; private set; }

        public string CreateTime { get; private set; }

        public string PayerPaymentMethod { get; private set; }

        public string PayerStatus { get; private set; }

        public string PayerEmail { get; private set; }

        public string PayerFirstName { get; private set; }

        public string PayerMiddleName { get; private set; }

        public string PayerLastName { get; private set; }

        public string PayerId { get; private set; }

        public string PayerCountryCode { get; private set; }

        public string ShippingAddressRecipientName { get; private set; }

        public string ShippingAddressStreet { get; private set; }

        public string ShippingAddressCity { get; private set; }

        public string ShippingAddressState { get; private set; }

        //int
        public string ShippingAddressPostalCode { get; private set; }

        public string ShippingAddressCountryCode { get; private set; }

        //double
        public string TransactionsAmountTotal { get; private set; }

        public string TransactionsAmountCurrency { get; private set; }

        //double
        public string TransactionsDetailsSubtotal { get; private set; }

        //double
        public string TransactionsDetailsShipping { get; private set; }

        //double
        public string TransactionsDetailsHandlingFee { get; private set; }

        //double
        public string TransactionsDetailsInsurance { get; private set; }

        //double
        public string TransactionsShippingDiscount { get; private set; }

        public string TransactionsItemListItemsName { get; private set; }

        //double
        public string TransactionsItemListItemsPrice { get; private set; }

        public string TransactionsItemListItemsCurrency { get; private set; }

        //int
        public string TransactionsItemListItemsQuantity { get; private set; }

        //double
        public string TransactionsItemListItemsTax { get; private set; }


        [NotMapped]
        public string IntentEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.Intent));
            }
            set
            {
                this.Intent = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string StateEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.State));
            }
            set
            {
                this.State = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string CartEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.Cart));
            }
            set
            {
                this.Cart = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string CreateTimeEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.CreateTime));
            }
            set
            {
                this.CreateTime = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string PayerPaymentMethodEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.PayerPaymentMethod));
            }
            set
            {
                this.PayerPaymentMethod = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string PayerStatusEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.PayerStatus));
            }
            set
            {
                this.PayerStatus = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string PayerEmailEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.PayerEmail));
            }
            set
            {
                this.PayerEmail = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string PayerFirstNameEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.PayerFirstName));
            }
            set
            {
                this.PayerFirstName = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string PayerMiddleNameEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.PayerMiddleName));
            }
            set
            {
                this.PayerMiddleName = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string PayerLastNameEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.PayerLastName));
            }
            set
            {
                this.PayerLastName = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string PayerIdEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.PayerId));
            }
            set
            {
                this.PayerId = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string PayerCountryCodeEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.PayerCountryCode));
            }
            set
            {
                this.PayerCountryCode = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string ShippingAddressRecipientNameEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.ShippingAddressRecipientName));
            }
            set
            {
                this.ShippingAddressRecipientName = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string ShippingAddressStreetEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.ShippingAddressStreet));
            }
            set
            {
                this.ShippingAddressStreet = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string ShippingAddressCityEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.ShippingAddressCity));
            }
            set
            {
                this.ShippingAddressCity = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string ShippingAddressStateEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.ShippingAddressState));
            }
            set
            {
                this.ShippingAddressState = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        //once int
        [NotMapped]
        public string ShippingAddressPostalCodeEncrypted
        {
            get
            {
                //if (this.ShippingAddressPostalCode.Contains("+"))
                //{
                //    return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.ShippingAddressPostalCode.Replace("+", "")));
                //}
                //else
                //{
                    return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.ShippingAddressPostalCode));
                //}
            }
            set
            {
                //string addedPlus = string.Empty;
                //if (value.Length % 4 != 0)
                //{
                //    addedPlus = value + "+";
                //    this.ShippingAddressPostalCode = Encr.EncapsulateByteArray(Encr.EncapsulateString(addedPlus));
                //}
                //else
                //{
                this.ShippingAddressPostalCode = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
                //}
            }
        }

        [NotMapped]
        public string ShippingAddressCountryCodeEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.ShippingAddressCountryCode));
            }
            set
            {
                this.ShippingAddressCountryCode = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        //double
        public string TransactionsAmountTotalEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsAmountTotal));
            }
            set
            {
                this.TransactionsAmountTotal = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string TransactionsAmountCurrencyEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsAmountCurrency));
            }
            set
            {
                this.TransactionsAmountCurrency = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        //double
        public string TransactionsDetailsSubtotalEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsDetailsSubtotal));
            }
            set
            {
                this.TransactionsDetailsSubtotal = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        //double
        public string TransactionsDetailsShippingEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsDetailsShipping));
            }
            set
            {
                this.TransactionsDetailsShipping = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        //double
        public string TransactionsDetailsHandlingFeeEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsDetailsHandlingFee));
            }
            set
            {
                this.TransactionsDetailsHandlingFee = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        //double
        public string TransactionsDetailsInsuranceEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsDetailsInsurance));
            }
            set
            {
                this.TransactionsDetailsInsurance = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        //double
        public string TransactionsShippingDiscountEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsShippingDiscount));
            }
            set
            {
                this.TransactionsShippingDiscount = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string TransactionsItemListItemsNameEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsItemListItemsName));
            }
            set
            {
                this.TransactionsItemListItemsName = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        //double
        public string TransactionsItemListItemsPriceEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsItemListItemsPrice));
            }
            set
            {
                this.TransactionsItemListItemsPrice = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string TransactionsItemListItemsCurrencyEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsItemListItemsCurrency));
            }
            set
            {
                this.TransactionsItemListItemsCurrency = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        //int
        public string TransactionsItemListItemsQuantityEncrypted
        {
            get
            {
                //if (this.TransactionsItemListItemsQuantity.Contains("+"))
                //{
                //    return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsItemListItemsQuantity.Replace("+", "")));
                //}
                //else
                //{
                    return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsItemListItemsQuantity));
                //}
            }
            set
            {
                //string addedPlus = string.Empty;
                //if (value.ToString().Length % 4 != 0)
                //{
                //    addedPlus = value + "+";
                //    this.TransactionsItemListItemsQuantity = Encr.EncapsulateByteArray(Encr.EncapsulateString(addedPlus));
                //}
                //else
                //{
                this.TransactionsItemListItemsQuantity = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
                //}
            }
        }

        [NotMapped]
        //double
        public string TransactionsItemListItemsTaxEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.TransactionsItemListItemsTax));
            }
            set
            {
                this.TransactionsItemListItemsTax = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }
    }
}