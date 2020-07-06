namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class dunno : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PayPalPaymentDetails", "TransactionsItemListItemsCurrency", c => c.String());
            DropColumn("dbo.PayPalPaymentDetails", "TransactionsItemListItemsCurrencty");
        }
        
        public override void Down()
        {
            AddColumn("dbo.PayPalPaymentDetails", "TransactionsItemListItemsCurrencty", c => c.String());
            DropColumn("dbo.PayPalPaymentDetails", "TransactionsItemListItemsCurrency");
        }
    }
}
