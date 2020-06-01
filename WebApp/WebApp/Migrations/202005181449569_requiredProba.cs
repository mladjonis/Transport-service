namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class requiredProba : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.LinePoints", "TransportLineID", "dbo.TransportLines");
            DropIndex("dbo.LinePoints", new[] { "TransportLineID" });
            AlterColumn("dbo.LinePoints", "TransportLineID", c => c.String(maxLength: 128));
            CreateIndex("dbo.LinePoints", "TransportLineID");
            AddForeignKey("dbo.LinePoints", "TransportLineID", "dbo.TransportLines", "TransportLineID");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.LinePoints", "TransportLineID", "dbo.TransportLines");
            DropIndex("dbo.LinePoints", new[] { "TransportLineID" });
            AlterColumn("dbo.LinePoints", "TransportLineID", c => c.String(nullable: false, maxLength: 128));
            CreateIndex("dbo.LinePoints", "TransportLineID");
            AddForeignKey("dbo.LinePoints", "TransportLineID", "dbo.TransportLines", "TransportLineID", cascadeDelete: true);
        }
    }
}
