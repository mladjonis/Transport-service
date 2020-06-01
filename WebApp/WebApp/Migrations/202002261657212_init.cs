namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Departures",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        TimeTable = c.String(),
                        ValidFrom = c.DateTime(nullable: false),
                        TransportLineID = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.TransportLines", t => t.TransportLineID)
                .Index(t => t.TransportLineID);
            
            CreateTable(
                "dbo.TransportLines",
                c => new
                    {
                        TransportLineID = c.String(nullable: false, maxLength: 128),
                        FromTo = c.String(),
                    })
                .PrimaryKey(t => t.TransportLineID);
            
            CreateTable(
                "dbo.LinePoints",
                c => new
                    {
                        LinePointID = c.Int(nullable: false, identity: true),
                        X = c.Double(nullable: false),
                        Y = c.Double(nullable: false),
                        TransportLineID = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.LinePointID)
                .ForeignKey("dbo.TransportLines", t => t.TransportLineID, cascadeDelete: true)
                .Index(t => t.TransportLineID);
            
            CreateTable(
                "dbo.Stations",
                c => new
                    {
                        StationID = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        X = c.Double(nullable: false),
                        Y = c.Double(nullable: false),
                        Address = c.String(),
                        TransportLine_TransportLineID = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.StationID)
                .ForeignKey("dbo.TransportLines", t => t.TransportLine_TransportLineID)
                .Index(t => t.TransportLine_TransportLineID);
            
            CreateTable(
                "dbo.StationsOnLines",
                c => new
                    {
                        StationsOnLineID = c.Int(nullable: false, identity: true),
                        StationID = c.Int(nullable: false),
                        TransportLineID = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.StationsOnLineID)
                .ForeignKey("dbo.Stations", t => t.StationID, cascadeDelete: true)
                .ForeignKey("dbo.TransportLines", t => t.TransportLineID, cascadeDelete: true)
                .Index(t => t.StationID)
                .Index(t => t.TransportLineID);
            
            CreateTable(
                "dbo.Vehicles",
                c => new
                    {
                        VehicleID = c.String(nullable: false, maxLength: 128),
                        X = c.Double(nullable: false),
                        Y = c.Double(nullable: false),
                        TransportLineID = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.VehicleID)
                .ForeignKey("dbo.TransportLines", t => t.TransportLineID)
                .Index(t => t.TransportLineID);
            
            CreateTable(
                "dbo.PriceFinals",
                c => new
                    {
                        ID = c.Int(nullable: false),
                        Price = c.Double(nullable: false),
                        PricelistID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.Pricelists", t => t.PricelistID, cascadeDelete: true)
                .ForeignKey("dbo.Tickets", t => t.ID)
                .Index(t => t.ID)
                .Index(t => t.PricelistID);
            
            CreateTable(
                "dbo.Pricelists",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        From = c.DateTime(nullable: false),
                        To = c.DateTime(),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.Tickets",
                c => new
                    {
                        TicketID = c.Int(nullable: false, identity: true),
                        TicketType = c.String(nullable: false),
                        BoughtAt = c.DateTime(),
                        UserID = c.String(nullable: false, maxLength: 128),
                        Expires = c.DateTime(),
                        PayPalPaymentDetailsID = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.TicketID)
                .ForeignKey("dbo.PayPalPaymentDetails", t => t.PayPalPaymentDetailsID)
                .ForeignKey("dbo.AspNetUsers", t => t.UserID, cascadeDelete: true)
                .Index(t => t.UserID)
                .Index(t => t.PayPalPaymentDetailsID);
            
            CreateTable(
                "dbo.PayPalPaymentDetails",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Intent = c.String(),
                        State = c.String(),
                        Cart = c.String(),
                        CreateTime = c.String(),
                        PayerPaymentMethod = c.String(),
                        PayerStatus = c.String(),
                        PayerEmail = c.String(),
                        PayerFirstName = c.String(),
                        PayerMiddleName = c.String(),
                        PayerLastName = c.String(),
                        PayerId = c.String(),
                        PayerCountryCode = c.String(),
                        ShippingAddressRecipientName = c.String(),
                        ShippingAddressStreet = c.String(),
                        ShippingAddressCity = c.String(),
                        ShippingAddressState = c.String(),
                        ShippingAddressPostalCode = c.Int(nullable: false),
                        ShippingAddressCountryCode = c.String(),
                        TransactionsAmountTotal = c.Double(nullable: false),
                        TransactionsAmountCurrency = c.String(),
                        TransactionsDetailsSubtotal = c.Double(nullable: false),
                        TransactionsDetailsShipping = c.Double(nullable: false),
                        TransactionsDetailsHandlingFee = c.Double(nullable: false),
                        TransactionsDetailsInsurance = c.Double(nullable: false),
                        TransactionsShippingDiscount = c.Double(nullable: false),
                        TransactionsItemListItemsName = c.String(),
                        TransactionsItemListItemsPrice = c.Double(nullable: false),
                        TransactionsItemListItemsCurrencty = c.String(),
                        TransactionsItemListItemsQuantity = c.Int(nullable: false),
                        TransactionsItemListItemsTax = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        UserTypeID = c.Int(),
                        Name = c.String(),
                        Surname = c.String(),
                        Adress = c.String(),
                        Password = c.String(),
                        ConfirmedPassword = c.String(),
                        DateOfBirth = c.DateTime(),
                        Status = c.String(),
                        HasVerified = c.Boolean(nullable: false),
                        Files = c.String(),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.UserTypes", t => t.UserTypeID)
                .Index(t => t.UserTypeID)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.UserTypes",
                c => new
                    {
                        UserTypeID = c.Int(nullable: false, identity: true),
                        TypeOfUser = c.Int(nullable: false),
                        Coefficient = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.UserTypeID);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.PriceFinals", "ID", "dbo.Tickets");
            DropForeignKey("dbo.AspNetUsers", "UserTypeID", "dbo.UserTypes");
            DropForeignKey("dbo.Tickets", "UserID", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Tickets", "PayPalPaymentDetailsID", "dbo.PayPalPaymentDetails");
            DropForeignKey("dbo.PriceFinals", "PricelistID", "dbo.Pricelists");
            DropForeignKey("dbo.Departures", "TransportLineID", "dbo.TransportLines");
            DropForeignKey("dbo.Vehicles", "TransportLineID", "dbo.TransportLines");
            DropForeignKey("dbo.Stations", "TransportLine_TransportLineID", "dbo.TransportLines");
            DropForeignKey("dbo.StationsOnLines", "TransportLineID", "dbo.TransportLines");
            DropForeignKey("dbo.StationsOnLines", "StationID", "dbo.Stations");
            DropForeignKey("dbo.LinePoints", "TransportLineID", "dbo.TransportLines");
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.AspNetUsers", new[] { "UserTypeID" });
            DropIndex("dbo.Tickets", new[] { "PayPalPaymentDetailsID" });
            DropIndex("dbo.Tickets", new[] { "UserID" });
            DropIndex("dbo.PriceFinals", new[] { "PricelistID" });
            DropIndex("dbo.PriceFinals", new[] { "ID" });
            DropIndex("dbo.Vehicles", new[] { "TransportLineID" });
            DropIndex("dbo.StationsOnLines", new[] { "TransportLineID" });
            DropIndex("dbo.StationsOnLines", new[] { "StationID" });
            DropIndex("dbo.Stations", new[] { "TransportLine_TransportLineID" });
            DropIndex("dbo.LinePoints", new[] { "TransportLineID" });
            DropIndex("dbo.Departures", new[] { "TransportLineID" });
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.UserTypes");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.PayPalPaymentDetails");
            DropTable("dbo.Tickets");
            DropTable("dbo.Pricelists");
            DropTable("dbo.PriceFinals");
            DropTable("dbo.Vehicles");
            DropTable("dbo.StationsOnLines");
            DropTable("dbo.Stations");
            DropTable("dbo.LinePoints");
            DropTable("dbo.TransportLines");
            DropTable("dbo.Departures");
        }
    }
}
