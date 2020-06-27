namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tospropertyaddedtouser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "AcceptedTOS", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "AcceptedTOS");
        }
    }
}
