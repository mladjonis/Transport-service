using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using WebApp.App_Start;
using WebApp.Models.DomainEntities;

namespace WebApp.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit https://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {

        #region Properties
        public int? UserTypeID { get; set; }
        
        public string Name { get; private set; }

        [NotMapped]
        public string NameEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.Name));
            }
            set
            {
                this.Name = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        [NotMapped]
        public string EmailEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.Email));
            }
            set
            {
                this.Email = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        public string Surname { get; private set; }

        [NotMapped]
        public string SurnameEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.Surname));
            }
            set
            {
                this.Surname = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        public string Adress { get; private set; }

        [NotMapped]
        public string AdressEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.Adress));
            }
            set
            {
                this.Adress = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        //[NotMapped]
        //public string UserNameEncrypted
        //{
        //    get
        //    {
        //        return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.UserName));
        //    }
        //    set
        //    {
        //        this.UserName = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
        //    }
        //}

        public string Password { get; set; }

        public string ConfirmedPassword { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public string Status { get; private set; }

        [NotMapped]
        public string StatusEncrypted
        {
            get
            {
                return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.Status));
            }
            set
            {
                this.Status = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
            }
        }

        public bool HasVerified { get; set; }

        public bool AcceptedTOS { get; set; }

        public string Files { get; set; }

        //[NotMapped]
        //public string FilesEncrypted
        //{
        //    get
        //    {
        //        return Encr.DecryptStringFromBytes(Encr.EncapsulateString(this.Files));
        //    }
        //    set
        //    {
        //        this.Files = Encr.EncapsulateByteArray(Encr.EncryptStringToBytes(value));
        //    }
        //}

        public virtual UserType UserType { get; set; }

        public virtual ICollection<Ticket> Tickets { get; set; }

        public virtual ICollection<BlogPost> BlogPosts { get; set; }
        #endregion

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }

        public static string HashPassword(string password)
        {
            byte[] salt;
            byte[] buffer2;
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, 0x10, 0x3e8))
            {
                salt = bytes.Salt;
                buffer2 = bytes.GetBytes(0x20);
            }
            byte[] dst = new byte[0x31];
            Buffer.BlockCopy(salt, 0, dst, 1, 0x10);
            Buffer.BlockCopy(buffer2, 0, dst, 0x11, 0x20);
            return Convert.ToBase64String(dst);
        }

        public static bool VerifyHashedPassword(string hashedPassword, string password)
        {
            byte[] buffer4;
            if (hashedPassword == null)
            {
                return false;
            }
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            byte[] src = Convert.FromBase64String(hashedPassword);
            if ((src.Length != 0x31) || (src[0] != 0))
            {
                return false;
            }
            byte[] dst = new byte[0x10];
            Buffer.BlockCopy(src, 1, dst, 0, 0x10);
            byte[] buffer3 = new byte[0x20];
            Buffer.BlockCopy(src, 0x11, buffer3, 0, 0x20);
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, dst, 0x3e8))
            {
                buffer4 = bytes.GetBytes(0x20);
            }
            return StructuralComparisons.StructuralEqualityComparer.Equals(buffer3, buffer4);
        }
    }
}