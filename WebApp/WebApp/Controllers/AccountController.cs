using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using Aspose.Zip;
using Aspose.Zip.Saving;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.StaticFiles.ContentTypes;
using WebApp.App_Start;
using WebApp.Models;
using WebApp.Persistence.UnitOfWork;
using WebApp.Providers;
using WebApp.Results;


namespace WebApp.Controllers
{
    //[Authorize]
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;
        private IUnitOfWork unitOfWork;
        private string localHost = "http://localhost:52295/docs/users/";

        public AccountController()
        {
        }

        public AccountController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public AccountController(ApplicationUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }


        /// <summary>
        /// GetAll()
        /// </summary>
        /// <returns></returns>
        //[Authorize(Roles ="Admin,Controller")]
        [Route("GetUsers/")]
        public IEnumerable<ApplicationUser> GetUsers()
        {
            return UserManager.Users.ToList();
        }

        //[Route("Roles/{id}")]
        [Route("Roles")]
        public IHttpActionResult GetRolesForUser([FromUri]string id)
        {
            return Ok(UserManager.GetRoles(id).FirstOrDefault());
        }

        /// <summary>
        /// Get()
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [ResponseType(typeof(ApplicationUser))]
        [Authorize(Roles = "Admin, AppUser, Controller")]
        [Route("GetUser")]
        public IHttpActionResult GetUser([FromUri]string id)
        {
            ApplicationUser user = unitOfWork.User.Get(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }


        ///// <summary>
        ///// Put()
        ///// </summary>
        ///// <param name="id"></param>
        ///// <param name="user"></param>
        ///// <returns></returns>
        [ResponseType(typeof(void))]
        [Route("ChageUserProfile/{id}")]
        [Authorize(Roles="Admin, Controller, AppUser")]
        [HttpPut]
        public async Task<IHttpActionResult> PutUser(string id, UserInfo user)
        {

            //ApplicationUser existingUser = UserManager.Users.Where(x => x.Id == id).FirstOrDefault();
            var existingUser = unitOfWork.User.Get(id);

            if (existingUser == null)
            {
                return BadRequest("Korisnik ne postoji");
            }

            //existingUser.Email = user.Email;
            existingUser.NameEncrypted = user.Name;
            existingUser.SurnameEncrypted = user.Surname;
            existingUser.AdressEncrypted = user.Adress;
            if (UserManager.IsInRole(existingUser.Id, "AppUser"))
            {
                if(user.UserType == "Obican")
                {
                    user.UserType = "regularan";
                }
                if (ConvertStringToInt(user.UserType.ToLower()) != existingUser.UserType.TypeOfUser)
                {
                    //UserType userType = unitOfWork.UserType.Find(ut => ut.TypeOfUser == ConvertStringToInt(user.UserType.ToLower())).FirstOrDefault();
                    var userType = unitOfWork.UserType.GetAll().Where(ut => ut.TypeOfUser == ConvertStringToInt(user.UserType.ToLower())).FirstOrDefault();
                    existingUser.UserTypeID = userType.UserTypeID;
                    existingUser.UserType = userType;
                }
                existingUser.DateOfBirth = DateTime.Parse(user.DateOfBirth);


            }

            //existingUser.EmailEncrypted = user.Email;

            try
            {
                unitOfWork.User.Update(existingUser);
                unitOfWork.Complete();
            }
            catch (Exception e)
            {

            }

            //IdentityResult result = await UserManager.UpdateAsync(existingUser);

            //if (!result.Succeeded)
            //{
            //    return BadRequest();
            //}

            return StatusCode(HttpStatusCode.NoContent);
        }


        /// <summary>
        /// Delete()
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [ResponseType(typeof(ApplicationUser))]
        //[Route("DeleteUser/{id}")]
        [Route("DeleteUser")]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult DeleteUser([FromUri]string id)
        {
            ApplicationUser user = UserManager.Users.FirstOrDefault(x => x.Id == id);
            if (user == null)
            {
                return BadRequest();
            }
            else
            {
                if (user.Tickets.Count() > 0)
                {
                    foreach (var ticket in user.Tickets)
                    {
                        var t = unitOfWork.Ticket.Get(ticket.TicketID);
                        unitOfWork.Ticket.Remove(t);
                        var pf = unitOfWork.PriceFinal.Get(ticket.PriceFinal.ID);
                        unitOfWork.PriceFinal.Remove(pf);
                    }
                    //unitOfWork.Complete();
                }
            }

            try
            {
                UserManager.Delete(user);
                unitOfWork.Complete();
            }
            catch (Exception e)
            {

            }

            return Ok(user);
        }

        [Route("DeleteSelf")]
        [Authorize]
        [HttpDelete]
        public IHttpActionResult DeleteSelf()
        {
            var userId = User.Identity.GetUserId();

            var user = UserManager.Users.FirstOrDefault(x => x.Id == userId);

            if (user == null)
            {
                return BadRequest();
            }
            else
            {
                if (user.Tickets.Count() > 0)
                {
                    foreach (var ticket in user.Tickets)
                    {
                        var t = unitOfWork.Ticket.Get(ticket.TicketID);
                        unitOfWork.Ticket.Remove(t);
                        var pf = unitOfWork.PriceFinal.Get(ticket.PriceFinal.ID);
                        unitOfWork.PriceFinal.Remove(pf);
                    }
                    //unitOfWork.Complete();
                }
            }

            try
            {
                UserManager.Delete(user);
                unitOfWork.Complete();
            }
            catch (Exception e)
            {

            }

            return Ok();
        }

        [AllowAnonymous]
        [Route("UserExists/{email}")]
        public bool UserExists(string email)
        {
            return UserManager.Users.FirstOrDefault(x => x.Email == email) != null;
        }


        // GET api/Account/UserInfo
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("UserInfo")]
        public UserInfoViewModel GetUserInfo()
        {
            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            return new UserInfoViewModel
            {
                Email = User.Identity.GetUserName(),
                HasRegistered = externalLogin == null,
                LoginProvider = externalLogin != null ? externalLogin.LoginProvider : null
            };
        }

        // POST api/Account/Logout
        [Route("Logout")]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }

        // GET api/Account/ManageInfo?returnUrl=%2F&generateState=true
        [Route("ManageInfo")]
        public async Task<ManageInfoViewModel> GetManageInfo(string returnUrl, bool generateState = false)
        {
            IdentityUser user = await UserManager.FindByIdAsync(User.Identity.GetUserId());

            if (user == null)
            {
                return null;
            }

            List<UserLoginInfoViewModel> logins = new List<UserLoginInfoViewModel>();

            foreach (IdentityUserLogin linkedAccount in user.Logins)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = linkedAccount.LoginProvider,
                    ProviderKey = linkedAccount.ProviderKey
                });
            }

            if (user.PasswordHash != null)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = LocalLoginProvider,
                    ProviderKey = user.UserName,
                });
            }

            return new ManageInfoViewModel
            {
                LocalLoginProvider = LocalLoginProvider,
                Email = user.UserName,
                Logins = logins,
                ExternalLoginProviders = GetExternalLogins(returnUrl, generateState)
            };
        }

        // POST api/Account/ChangePassword
        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePasswordAsync(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(),model.OldPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok(true);
        }

        // POST api/Account/SetPassword
        [Route("SetPassword")]
        public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/AddExternalLogin
        [Route("AddExternalLogin")]
        public async Task<IHttpActionResult> AddExternalLogin(AddExternalLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

            AuthenticationTicket ticket = AccessTokenFormat.Unprotect(model.ExternalAccessToken);

            if (ticket == null || ticket.Identity == null || (ticket.Properties != null
                && ticket.Properties.ExpiresUtc.HasValue
                && ticket.Properties.ExpiresUtc.Value < DateTimeOffset.UtcNow))
            {
                return BadRequest("External login failure.");
            }

            ExternalLoginData externalData = ExternalLoginData.FromIdentity(ticket.Identity);

            if (externalData == null)
            {
                return BadRequest("The external login is already associated with an account.");
            }

            IdentityResult result = await UserManager.AddLoginAsync(User.Identity.GetUserId(),
                new UserLoginInfo(externalData.LoginProvider, externalData.ProviderKey));

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/RemoveLogin
        [Route("RemoveLogin")]
        public async Task<IHttpActionResult> RemoveLogin(RemoveLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result;

            if (model.LoginProvider == LocalLoginProvider)
            {
                result = await UserManager.RemovePasswordAsync(User.Identity.GetUserId());
            }
            else
            {
                result = await UserManager.RemoveLoginAsync(User.Identity.GetUserId(),
                    new UserLoginInfo(model.LoginProvider, model.ProviderKey));
            }

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // GET api/Account/ExternalLogin
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalCookie)]
        [AllowAnonymous]
        [Route("ExternalLogin", Name = "ExternalLogin")]
        public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
        {
            if (error != null)
            {
                return Redirect(Url.Content("~/") + "#error=" + Uri.EscapeDataString(error));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return new ChallengeResult(provider, this);
            }

            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            if (externalLogin == null)
            {
                return InternalServerError();
            }

            if (externalLogin.LoginProvider != provider)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                return new ChallengeResult(provider, this);
            }

            ApplicationUser user = await UserManager.FindAsync(new UserLoginInfo(externalLogin.LoginProvider,
                externalLogin.ProviderKey));

            bool hasRegistered = user != null;

            if (hasRegistered)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                
                 ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(UserManager,
                    OAuthDefaults.AuthenticationType);
                ClaimsIdentity cookieIdentity = await user.GenerateUserIdentityAsync(UserManager,
                    CookieAuthenticationDefaults.AuthenticationType);

                //bilo je user.UserName
                AuthenticationProperties properties = ApplicationOAuthProvider.CreateProperties(user.UserName);
                Authentication.SignIn(properties, oAuthIdentity, cookieIdentity);
                return Ok();//nije bilo
            }
            else
            {
                IEnumerable<Claim> claims = externalLogin.GetClaims();
                ClaimsIdentity identity = new ClaimsIdentity(claims, OAuthDefaults.AuthenticationType);
                Authentication.SignIn(identity);
                return Ok();// nije bilo
            }
        }

        // GET api/Account/ExternalLogins?returnUrl=%2F&generateState=true
        [AllowAnonymous]
        [Route("ExternalLogins")]
        public IEnumerable<ExternalLoginViewModel> GetExternalLogins(string returnUrl, bool generateState = false)
        {
            IEnumerable<AuthenticationDescription> descriptions = Authentication.GetExternalAuthenticationTypes();
            List<ExternalLoginViewModel> logins = new List<ExternalLoginViewModel>();

            string state;

            if (generateState)
            {
                const int strengthInBits = 256;
                state = RandomOAuthStateGenerator.Generate(strengthInBits);
            }
            else
            {
                state = null;
            }

            foreach (AuthenticationDescription description in descriptions)
            {
                ExternalLoginViewModel login = new ExternalLoginViewModel
                {
                    Name = description.Caption,
                    Url = Url.Route("ExternalLogin", new
                    {
                        provider = description.AuthenticationType,
                        response_type = "token",
                        client_id = Startup.PublicClientId,
                        redirect_uri = new Uri(Request.RequestUri, returnUrl).AbsoluteUri,
                        state = state
                    }),
                    State = state
                };
                logins.Add(login);
            }

            return logins;
        }

        [NonAction]
        private int? ConvertStringToInt(string tipKorisnika)
        {
            if (tipKorisnika.Equals("Regularan") || tipKorisnika.Equals("Obican"))
            {
                return 0;
            }
            else if (tipKorisnika.Equals("Student"))
            {
                return 1;
            }
            else if (tipKorisnika.Equals("Penzioner"))
            {
                return 2;
            }
            else
            {
                return 0;
            }

        }

        [NonAction]
        private string ConvertIntToString(int usertype)
        {
            if (usertype == 0)
            {
                return "Obican";
            }
            else if (usertype == 1)
            {
                return "Student";
            }
            else if (usertype ==2 )
            {
                return "Penzioner";
            }
            else
            {
                return "Obican";
            }
        }

        [AllowAnonymous]
        [Route("ResetPassword", Name = "ResetPasswordRoute")]
        [HttpPost]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordBindingModel resetPasswordBindingModel)
        {
            if (ModelState.IsValid)
            {
                //var user = await UserManager.FindByEmailAsync(resetPasswordBindingModel.Email);
                var user = unitOfWork.User.GetAll().Where(u => u.EmailEncrypted == resetPasswordBindingModel.Email).FirstOrDefault();
                if (user != null)
                {
                    var resetPasswordResult = await UserManager.ResetPasswordAsync(user.Id, resetPasswordBindingModel.Token, resetPasswordBindingModel.NewPassword);

                    if (resetPasswordResult.Succeeded)
                    {
                        return Ok("New password set successfully");
                    }
                    else
                    {
                        return GetErrorResult(resetPasswordResult);
                    }
                }
            }
            return BadRequest();
        }

        [AllowAnonymous]
        [Route("ForgotPassword", Name="ForgotPasswordRoute")]
        [HttpPost]
        public async Task<IHttpActionResult> ForgotPassword(PasswordRecovery model)
        {
            //var user = await UserManager.FindByEmailAsync(model.Email);
            var user = unitOfWork.User.GetAll().Where(u => u.EmailEncrypted == model.Email).FirstOrDefault();
            var emailConfirmed = await UserManager.IsEmailConfirmedAsync(user.Id);

            if (user != null && emailConfirmed == true)
            {
                var passwordResetToken = await UserManager.GeneratePasswordResetTokenAsync(user.Id);

                //mvc primer
                //var confirmationLinkBackend = new Uri(Url.Link("ResetPasswordRoute", new { userId = user.Id, token = passwordResetToken }));
                //SendEMailHelper.Send(user.Email, "Reset your password for transport service", "Please confirm your password reset by clicking <a href=\"" + confirmationLinkBackend + "\">here</a>");


                var confirmationLinkFrontend = new Uri("http://localhost:4200/password-recovery").AddQuery("email",model.Email).AddQuery("token", passwordResetToken);
                SendEMailHelper.Send(user.EmailEncrypted, "Reset your password for transport service", "Please confirm your password reset by clicking <a href=\"" + confirmationLinkFrontend + "\">here</a>");
            }

            return Ok("If you have account with that email address on our platform you will recieve link for password reset.");
        }

        [AllowAnonymous]
        [Route("ResendConfirmationEmail")]
        [HttpPost]
        public async Task<IHttpActionResult> ResendConfirmationEmail(EmailConfirmationRecovery model)
        {
            var user = unitOfWork.User.GetAll().Where(u => u.EmailEncrypted == model.Email).FirstOrDefault();

            if (user != null)
            {
                var em = user.EmailEncrypted;
                user.Email = em;
                unitOfWork.User.Update(user);
                unitOfWork.Complete();
                var emailToken = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);

                //mvc
                //var confirmationLink = new Uri(Url.Link("ConfirmEmailRoute", new { userId = user.Id, token = emailToken }));

                var confirmationLinkFrontend = new Uri("http://localhost:4200/email-send").AddQuery("email", model.Email).AddQuery("token", emailToken);
                SendEMailHelper.Send(user.Email, "Confirm your email for transport service", "Please confirm your email by clicking <a href=\"" + confirmationLinkFrontend + "\">here</a>");
                user.EmailEncrypted = em;
                unitOfWork.User.Update(user);
                unitOfWork.Complete();
            }

            return Ok();
        }

        [AllowAnonymous]
        [Route("ConfirmEmail",Name ="ConfirmEmailRoute")]
        [HttpPost]
        public async Task<IHttpActionResult> ConfirmEmail(EmailConfirmation model)
        {
            var user = unitOfWork.User.GetAll().Where(u => u.EmailEncrypted == model.Email).FirstOrDefault();
            var em = user.EmailEncrypted;
            if (user != null)
            {
                user.Email = em;
                unitOfWork.User.Update(user);
                unitOfWork.Complete();
                //var emailToken = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                IdentityResult result = await UserManager.ConfirmEmailAsync(user.Id, model.Token);
                if (result.Succeeded)
                {
                    user.EmailEncrypted = em;
                    user.EmailConfirmed = true;
                    unitOfWork.User.Update(user);
                    unitOfWork.Complete();
                    return Ok("Uspesno potvrdjen e-mail");
                }
                else
                {
                    return GetErrorResult(result);
                }
            }
            return Ok(HttpStatusCode.NoContent);
        }

        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        [ResponseType(typeof(ApplicationUser))]
        [HttpPost]
        public async Task<IHttpActionResult> Register()
        {

            var httpRequest = HttpContext.Current.Request;

            var email = httpRequest.Form.Get("email").ToString();

            //check if user with that username already exists in db 
            var dbUser = unitOfWork.User.GetAll().Where(u => u.EmailEncrypted == email).FirstOrDefault();

            if(dbUser != null)
            {
                return BadRequest("Korisnik sa tim korisnickim imenom vec postoji, probajte drugo!");
            }


            var samoDavidim = httpRequest.Files;

            string status = "not verified";
            var utId = ConvertStringToInt(httpRequest.Form.Get("usertype"));
            var userType = unitOfWork.UserType.Find(x => x.TypeOfUser == utId).FirstOrDefault();
            //if (httpRequest.Form.Get("usertype") != "Obican")
            //    status = "not verified";


            var username = $"{httpRequest.Form.Get("email").Split('@')[0]}@{httpRequest.Form.Get("email").Split('@')[1].Split('.')[0]}";
            bool.TryParse(httpRequest.Form.Get("tos"),out bool res);
            var user = new ApplicationUser()
            {
                Id = httpRequest.Form.Get("email").Split('@')[0],
                UserName = username,
                EmailEncrypted = httpRequest.Form.Get("email"),
                PasswordHash = ApplicationUser.HashPassword(httpRequest.Form.Get("password")),
                DateOfBirth = DateTime.Parse(httpRequest.Form.Get("date")),
                AdressEncrypted = httpRequest.Form.Get("address"),
                NameEncrypted = httpRequest.Form.Get("name"),
                SurnameEncrypted = httpRequest.Form.Get("surname"),
                StatusEncrypted = status,
                UserTypeID = userType.UserTypeID,
                Files = "",
                AcceptedTOS = res
            };
            UserManager.UpdateSecurityStamp(user.Id);
            unitOfWork.Complete();
            //IdentityResult result = UserManager.Create(user);
            unitOfWork.User.Add(user);
            unitOfWork.Complete();

            //if (!result.Succeeded)
            if(unitOfWork.User.Get(user.Id)==null)
            {
                ///return GetErrorResult(result);
            } else
            {
                UserManager.AddToRole(user.Id, "AppUser");
                var em = user.EmailEncrypted;
                user.Email = em;
                unitOfWork.User.Update(user);
                unitOfWork.Complete();

                var emailToken = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);

                var confirmationLinkFrontend = new Uri("http://localhost:4200/email-send").AddQuery("email", user.Email).AddQuery("token", emailToken);
                ///var confirmationLink = new Uri(Url.Link("ConfirmEmailRoute", new { userId = user.Id, token = emailToken }));

                SendEMailHelper.Send(user.Email, "Confirm your email for transport service", "Please confirm your email by clicking <a href=\"" + confirmationLinkFrontend + "\">here</a>");

                user.EmailEncrypted = em;
                unitOfWork.User.Update(user);
                unitOfWork.Complete();

                if (httpRequest.Files.Count > 0)
                {
                    var path = GetUserFolderPath(user.Id);
                    CreateUserFolder(path);

                    List<string> uploadedFiles = new List<string>();
                    foreach(string file in httpRequest.Files)
                    {
                        var uploadedFile = httpRequest.Files[file];

                        if (IsCorrectFileExtension(uploadedFile.FileName)){
                            uploadedFile.SaveAs(path + "/" + uploadedFile.FileName);
                            uploadedFiles.Add(uploadedFile.FileName);
                        }
                    }

                    if(uploadedFiles.Count > 0)
                    {
                        if (user.Files != null && user.Files.Length > 0)
                            user.Files += "," + string.Join(",", uploadedFiles);
                        else
                            user.Files = string.Join(",", uploadedFiles);

                        user.StatusEncrypted = "processing";
                        unitOfWork.User.Update(user);
                        unitOfWork.Complete();
                    }
                }
            }

            return Ok(user);
        }

        // POST api/Account/RegisterExternal
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("RegisterExternal")]
        public async Task<IHttpActionResult> RegisterExternal(RegisterExternalBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var info = await Authentication.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return InternalServerError();
            }

            var user = new ApplicationUser() { UserName = model.Email, Email = model.Email };

            IdentityResult result = await UserManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            result = await UserManager.AddLoginAsync(user.Id, info.Login);
            if (!result.Succeeded)
            {
                return GetErrorResult(result); 
            }
            return Ok();
        }

        [Route("ProcessingUsers")]
        [Authorize(Roles = "Controller")]
        [HttpGet]
        public List<ApplicationUser> GetProcessingUsers()
        {
            return UserManager.Users.ToList().FindAll(x => x.StatusEncrypted == "processing");
        }

        [Route("VerifyUser")]
        [Authorize(Roles ="Controller")]
        [HttpPut]
        public IHttpActionResult VerifyUser([FromUri]string id)
        {
            var a = UserManager.Users.ToList();

            //var user = UserManager.Users.FirstOrDefault(x => x.Id == id);
            var user = unitOfWork.User.Get(id);

            if (user == null)
            {
                return BadRequest("User does not exists");
            }

            if (!UserManager.IsInRole(id, "AppUser"))
            {
                return BadRequest();
            }

            user.StatusEncrypted = "verified";
            unitOfWork.User.Update(user);
            unitOfWork.Complete();

            return Ok();
        }

        [Route("DenyUser")]
        [Authorize(Roles = "Controller")]
        [HttpPut]
        public IHttpActionResult DenyUser([FromUri]string id)
        {
            //var user = UserManager.Users.FirstOrDefault(x => x.Id == id);
            var user = unitOfWork.User.Get(id);

            if (user == null)
            {
                return BadRequest("User does not exists");
            }

            if (!UserManager.IsInRole(id, "AppUser"))
            {
                return BadRequest();
            }

            user.StatusEncrypted = "denied";
            unitOfWork.User.Update(user);
            unitOfWork.Complete();


            return Ok();
        }

        [Route("AddUserToRole")]
        [HttpPut]
        [Authorize(Roles ="Admin")]
        public IHttpActionResult AddUserToRole([FromUri]string id, [FromUri]string role)
        {
            var user = UserManager.Users.FirstOrDefault(x => x.Id == id);

            if (user == null)
            {
                return BadRequest("User does not exists");
            }

            var em = user.EmailEncrypted;
            user.Email = em;
            UserManager.Update(user);
            unitOfWork.Complete();
            var userRoles = UserManager.GetRoles(id).ToArray();
            var removeResult = UserManager.RemoveFromRoles(id, userRoles);

            if (removeResult.Succeeded)
            {
                UserManager.AddToRole(id, role);
                UserManager.Update(user);
                //unitOfWork.User.Update(user);
                unitOfWork.Complete();
                user.EmailEncrypted = em;
                UserManager.Update(user);
                unitOfWork.Complete();
                return Ok();
            } else
            {
                return BadRequest("Doslo je do greske u dodavanju korisnika u rolu");
            }
        }

        [Route("RemoveUserFromRole")]
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult RemoveUserFromRole([FromUri]string id)
        {
            var user = UserManager.Users.FirstOrDefault(x => x.Id == id);

            if (user == null)
            {
                return BadRequest("User does not exists");
            }

            var em = user.EmailEncrypted;
            user.Email = em;
            UserManager.Update(user);
            unitOfWork.Complete();

            var userRoles = UserManager.GetRoles(id).ToArray();
            var removeResult = UserManager.RemoveFromRoles(id, userRoles);
            if (removeResult.Succeeded)
            {
                UserManager.AddToRole(id, "AppUser");
                UserManager.Update(user);
                //unitOfWork.User.Update(user);
                unitOfWork.Complete();
                user.EmailEncrypted = em;
                UserManager.Update(user);
                unitOfWork.Complete();
                return Ok();
            }
            else
            {
                return BadRequest("Doslo je do greske u dodavanju korisnika u rolu");
            }
        }

        [Route("UploadPictures")]
        [ResponseType(typeof(string))]
        [HttpPost]
        public IHttpActionResult PictureUpload()
        {
            var httpRequest = HttpContext.Current.Request;

            var userId = User.Identity.GetUserId();

            //var user = UserManager.Users.FirstOrDefault(x => x.Id == userId);
            var user = unitOfWork.User.Get(userId);

            if (user == null)
                return BadRequest("User does not exist");

            var userPath = GetUserFolderPath(userId);
            CreateUserFolder(userPath);

            if (httpRequest.Files.Count == 0)
                return BadRequest("No files selected");

            List<string> uploadedFiles = new List<string>();
            foreach(string file in httpRequest.Files)
            {
                var uploadedFile = httpRequest.Files[file];

                if(IsCorrectFileExtension(uploadedFile.FileName))
                {
                    uploadedFile.SaveAs(userPath + "/" + uploadedFile.FileName);
                    uploadedFiles.Add(uploadedFile.FileName);
                }
            }

            if (uploadedFiles.Count == 0)
                return BadRequest("Error occured invalid file type");

            if (user.Files == null)
                user.Files = "";

            if (user.Files != null && user.Files.Length > 0)
                //user.Files += "," + string.Join(",", uploadedFiles);
                user.Files = uploadedFiles[0];
            else 
                //user.Files = string.Join(",", uploadedFiles);
                user.Files = uploadedFiles[0];

            user.StatusEncrypted = "processing";
            ///UserManager.Update(user);
            unitOfWork.User.Update(user);
            unitOfWork.Complete();
            return Ok(user.Files);
        }

        [HttpPut]
        [Route("ChangeTOS")]
        public IHttpActionResult ChangeTOS([FromUri]bool tos)
        {
            try
            {
                var userId = User.Identity.GetUserId();
                var user = unitOfWork.User.Get(userId);
                user.AcceptedTOS = tos;
                unitOfWork.User.Update(user);
                unitOfWork.Complete();
            }catch (Exception e)
            {
                //log
            }
            return Ok();
        }

        [HttpGet]
        [Route("Export")]
        public IHttpActionResult Export([FromUri]string exportType)
        {
            var userId = User.Identity.GetUserId();
            //var userId = "lukaja.jr";
            var user = unitOfWork.User.Get(userId);
            var usertype = ConvertIntToString(user.UserType.TypeOfUser);
            DataLinks links;
            try
            {
                string imgPath = string.Empty;

                if (!string.IsNullOrEmpty(user.Files))
                {
                    imgPath = $"{GetUserFolderPath(userId)}/{user.Files}";
                }
                var folderPath = GetUserDocumentFolderPath(userId);
                CreateUserFolder(folderPath);
                //var userPath = $"{folderPath}\\{user.Id}";
                var userPath = $"{folderPath}";
                localHost += $"{userId}/";
                if (exportType.Split('.').Length > 1)
                {
                    Exporter.ExportCsv(userPath, user, usertype, localHost, out Uri dataPath, out Uri ppPath);
                    Exporter.ExportPdf(userPath, user, usertype, localHost, imgPath, out Uri dataPdfPath);
                    links = new DataLinks(dataPath, ppPath, dataPdfPath);
                    string[] stringSeparators = new string[] { $"\\{user.Id}" };
                    //ne moze se zipovati onaj direktorijum koji koristimo promeniti puvanju na bude u istoj ravnini sa appu a ne u appu
                    using (FileStream zipFile = File.Open(userPath.Split(stringSeparators, StringSplitOptions.None)[0] + $"\\{user.NameEncrypted}.zip", FileMode.Create))
                    {
                        using (Archive archive = new Archive())
                        {
                            DirectoryInfo corpus = new DirectoryInfo(folderPath);
                            archive.CreateEntries(corpus);
                            archive.Save(zipFile);
                            archive.Dispose();
                            //return GetDocuments(userPath.Split(stringSeparators, StringSplitOptions.None)[0], user.NameEncrypted, "zip");
                        }
                        zipFile.Close();
                    }
                    return GetDocuments(userPath.Split(stringSeparators, StringSplitOptions.None)[0], user.NameEncrypted, "zip");

                    //return GetDocuments(userPath, user.Name, "csv");
                    //return GetDocuments(userPath, user.Name, "pdf");

                }
                else if (exportType.Equals("csv"))
                {
                    Exporter.ExportCsv(userPath, user, usertype, localHost, out Uri dataPath, out Uri ppPath);
                    links = new DataLinks(dataPath, ppPath, null);

                    using (FileStream zipFile = File.Open(userPath + $"\\{user.NameEncrypted}CSV.zip", FileMode.Create))
                    {
                        // Files to be added to archive
                        FileInfo fi1 = new FileInfo($"{userPath}\\{user.NameEncrypted}{user.SurnameEncrypted}.csv");
                        FileInfo fi2 = new FileInfo($"{userPath}\\{user.NameEncrypted}{user.SurnameEncrypted}PayPal.csv");

                        using (var archive = new Archive())
                        {
                            archive.CreateEntry($"{userPath}\\{user.NameEncrypted}{user.SurnameEncrypted}.csv", fi1);
                            archive.CreateEntry($"{userPath}\\{user.NameEncrypted}{user.SurnameEncrypted}PayPal.csv", fi2);
                            archive.Save(zipFile, new ArchiveSaveOptions() { Encoding = Encoding.UTF8 });
                        }
                    }
                    return GetDocuments(userPath, $"{user.NameEncrypted}CSV", "zip");


                }
                else if (exportType.Equals("pdf"))
                {
                    Exporter.ExportPdf(userPath, user, usertype, localHost, imgPath, out Uri dataPdfPath);
                    links = new DataLinks(null, null, dataPdfPath);
                    return GetDocuments(userPath, user.NameEncrypted + user.SurnameEncrypted, "pdf");
                }
                else
                {
                    links = new DataLinks(null, null, null);
                }


                return Ok(links);
            }
            catch (Exception ex)
            {
                //log
            }
            return Ok(HttpStatusCode.NoContent);
        }

        private IHttpActionResult GetDocuments(string userPath,string name, string docType)
        {
            var file = File.ReadAllBytes(userPath+ $"\\{name}.{docType}");
            IHttpActionResult response;
            HttpResponseMessage responseMsg = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(file)
            };
            responseMsg.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            responseMsg.Content.Headers.ContentDisposition.FileName = $"{name}.{docType}";
            //responseMsg.Content.Headers.ContentType = new MediaTypeHeaderValue($"application/{docType}");
            //responseMsg.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(docType));
            string contentType;
            new FileExtensionContentTypeProvider().TryGetContentType($"{name}.{docType}", out contentType);
            responseMsg.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType ?? "application/octet-stream");
            response = ResponseMessage(responseMsg);
            return response;
        }



        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private void CreateUserFolder(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }

        private string GetUserFolderPath(string userId)
        {
            return System.Web.Hosting.HostingEnvironment.MapPath("~/imgs/users/" + userId);
        }

        private string GetUserDocumentFolderPath(string userId)
        {
            return System.Web.Hosting.HostingEnvironment.MapPath("~/docs/users/" + userId);
        }

        private bool IsCorrectFileExtension(string fileName)
        {
            var fileExtension = fileName.Split('.').Last();

            if (fileExtension == "jpg" || fileExtension == "jpeg" || fileExtension == "png" || fileExtension == "bmp")
            {
                return true;
            }
            return false;
        }



        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }

            public IList<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }


        #endregion
    }
}
