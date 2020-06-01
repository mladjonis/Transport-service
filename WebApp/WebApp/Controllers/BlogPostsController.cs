using System;
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
    public class BlogPostsController : ApiController
    {
        private IUnitOfWork unitOfWork;

        public BlogPostsController()
        {
        }

        public BlogPostsController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        // GET: api/BlogPosts
        public IEnumerable<BlogPost> GetBlogPosts()
        {
            return unitOfWork.BlogPost.GetAll();
        }

        // GET: api/BlogPosts/5
        [ResponseType(typeof(BlogPost))]
        public IHttpActionResult GetBlogPost(int id)
        {
            BlogPost blogPost = unitOfWork.BlogPost.Get(id);
            if (blogPost == null)
            {
                return NotFound();
            }

            return Ok(blogPost);
        }

        // PUT: api/BlogPosts/5
        [ResponseType(typeof(void))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PutBlogPost(int id, BlogPost blogPost)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != blogPost.ID)
            {
                return BadRequest();
            }

            try
            {
                var blog = unitOfWork.BlogPost.Get(id);
                blog.BlogText = blogPost.BlogText;
                unitOfWork.BlogPost.Update(blog);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BlogPostExists(id))
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

        // POST: api/BlogPosts
        [ResponseType(typeof(BlogPost))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult PostBlogPost(BlogPost blogPost)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                unitOfWork.BlogPost.Add(blogPost);
                unitOfWork.Complete();
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return CreatedAtRoute("DefaultApi", new { id = blogPost.ID }, blogPost);
        }

        // DELETE: api/BlogPosts/5
        [ResponseType(typeof(BlogPost))]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult DeleteBlogPost(int id)
        {
            BlogPost blogPost = unitOfWork.BlogPost.Get(id);
            if (blogPost == null)
            {
                return NotFound();
            }

            try
            {
                unitOfWork.BlogPost.Remove(blogPost);
                unitOfWork.Complete();
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok(blogPost);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BlogPostExists(int id)
        {
            return unitOfWork.BlogPost.Find(e => e.ID == id).Count() > 0;
        }
    }
}