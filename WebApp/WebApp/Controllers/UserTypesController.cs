using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models.DomainEntities;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class UserTypesController : ApiController
    {
        private IUnitOfWork unitOfWork;

        public UserTypesController() { }

        public UserTypesController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }


        // GET: api/UserTypes
        public IEnumerable<UserType> GetUserTypes()
        {
            return unitOfWork.UserType.GetAll();
        }

        // GET: api/UserTypes/5
        [ResponseType(typeof(UserType))]
        public IHttpActionResult GetUserType(int id)
        {
            UserType userType = unitOfWork.UserType.Get(id);
            if (userType == null)
            {
                return NotFound();
            }

            return Ok(userType);
        }

        // PUT: api/UserTypes/5
        [ResponseType(typeof(void))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PutUserType(int id, UserType userType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userType.UserTypeID)
            {
                return BadRequest();
            }

           

            try
            {
                unitOfWork.UserType.Update(userType);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserTypeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/UserTypes
        [ResponseType(typeof(UserType))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PostUserType(UserType userType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                unitOfWork.UserType.Add(userType);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return CreatedAtRoute("DefaultApi", new { id = userType.UserTypeID }, userType);
        }

        // DELETE: api/UserTypes/5
        [ResponseType(typeof(UserType))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult DeleteUserType(int id)
        {
            UserType userType = unitOfWork.UserType.Get(id);
            if (userType == null)
            {
                return NotFound();
            }

            try
            {
                unitOfWork.UserType.Remove(userType);
                unitOfWork.Complete();
            }
            catch
            {
                throw;
            }

            return Ok(userType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserTypeExists(int id)
        {
            return unitOfWork.UserType.Find(e => e.UserTypeID == id).Count() > 0;
        }
    }
}