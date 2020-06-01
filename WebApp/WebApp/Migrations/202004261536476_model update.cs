namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class modelupdate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BlogPosts",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        PublishedAt = c.DateTime(),
                        BlogText = c.String(),
                        UserID = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.AspNetUsers", t => t.UserID)
                .Index(t => t.UserID);
            
            AddColumn("dbo.Tickets", "PriceRSD", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.BlogPosts", "UserID", "dbo.AspNetUsers");
            DropIndex("dbo.BlogPosts", new[] { "UserID" });
            DropColumn("dbo.Tickets", "PriceRSD");
            DropTable("dbo.BlogPosts");
        }
    }
}
