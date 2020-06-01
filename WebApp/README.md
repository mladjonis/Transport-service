# WebAppBackend

## Changing Project URL

If you want to change Project Url in Properties -> Web -> Project Url, for application to run you need to change ISSUER variable in App_Start/Startup.Auth.cs to same as new Project Url.

## Enabling Email service

If you want to enable email service in project please follow this instruction:
    * Go to Web.config
    * Find appSetings tag
    * Edit values for these keys
        * <add key="emailProviderEmail" value=""/>
        * <add key="emailProviderPassword" value=""/>
        * <add key="emailProviderPort" value=""/>
        * <add key="emailProviderHost" value=""/>
    ***emailProviderEmail and emailProviderPassword are credentials for your 'system' (all e-mails are going to be sent from this e-mail address)***
    ***emailProviderPort and emailProviderHost are SMTP properties see at [SMTP Settings](https://www.yetesoft.com/pop-smtp-server-settings/)***


## Changing validation settings

If you want to change current validations for Identity go to App_Start/IdentityConfig.cs and edit Create method.

## DB Seed

For seeding DB with current data type in Package Manager Console: update-database
If you want to change seeding for DB go to Migrations/Configuration.cs and in seed method you will see instruction for full seeding for bus stops and bus routes.

