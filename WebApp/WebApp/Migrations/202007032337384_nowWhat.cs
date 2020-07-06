namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nowWhat : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.PayPalPaymentDetails", "ShippingAddressPostalCode", c => c.String());
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsAmountTotal", c => c.String());
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsDetailsSubtotal", c => c.String());
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsDetailsShipping", c => c.String());
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsDetailsHandlingFee", c => c.String());
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsDetailsInsurance", c => c.String());
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsShippingDiscount", c => c.String());
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsItemListItemsPrice", c => c.String());
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsItemListItemsQuantity", c => c.String());
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsItemListItemsTax", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsItemListItemsTax", c => c.Double(nullable: false));
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsItemListItemsQuantity", c => c.Int(nullable: false));
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsItemListItemsPrice", c => c.Double(nullable: false));
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsShippingDiscount", c => c.Double(nullable: false));
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsDetailsInsurance", c => c.Double(nullable: false));
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsDetailsHandlingFee", c => c.Double(nullable: false));
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsDetailsShipping", c => c.Double(nullable: false));
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsDetailsSubtotal", c => c.Double(nullable: false));
            AlterColumn("dbo.PayPalPaymentDetails", "TransactionsAmountTotal", c => c.Double(nullable: false));
            AlterColumn("dbo.PayPalPaymentDetails", "ShippingAddressPostalCode", c => c.Int(nullable: false));
        }
    }
}
